import { useContext, useEffect, useState } from 'react';
import styles from './Subject.module.css';
import { useNavigate } from 'react-router-dom';
import { getSubject, postSubject, postFile, getFile } from '../../Services/common';
import Loader from '../../Components/loader/Loader';
import { UserContext } from '../../Services/userContext';
import { useNotificationPopup } from '../../Services/notificationPopupProvider';

const Subject = () => {
  const [newReview, setNewReview] = useState('');
  const [reviews, setReviews] = useState();
  const [data, setData] = useState();
  const [uploading, setUploading] = useState(false);
  const [downloadingFileId, setDownloadingFileId] = useState(null);
  const { logout } = useContext(UserContext);
  const { showSnackNotificationPopup } = useNotificationPopup();

  const history = useNavigate();

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const id = urlParams.get('id');

  const navigate = useNavigate();

  if (!id) {
    navigate('/');
  }

  useEffect(() => {
    subjectFetch();
  }, [id]);

  const subjectFetch = () => {
    getSubject(id)
      .then((res) => {
        setData(res);
        setReviews(res.reviews);
      })
      .catch((error) => {
        if (error.message === 'UNAUTHORIZED') {
          logout();
        } else {
          showSnackNotificationPopup({ status: 'FAILED', text: error.message });
        }
      });
  };

  const handleAddReview = () => {
    if (newReview.trim()) {
      postSubject(id, newReview)
        .then((res) => {
          setReviews([...reviews, { name: res.name, review: res.review }]);
          setNewReview('');
        })
        .catch((error) => {
          if (error.message === 'UNAUTHORIZED') {
            logout();
          } else {
            showSnackNotificationPopup({ status: 'FAILED', text: error.message });
          }
        });
    }
  };

  const handleNavigate = (item) => {
    history(`/lecturer/?id=${item}`);
  };

  // File upload handler
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    postFile(id, file)
      .then(() => {
        subjectFetch();
        showSnackNotificationPopup({ status: 'COMPLETED', text: 'File uploaded successfully.' });
      })
      .catch((error) => {
        if (error.message === 'UNAUTHORIZED') {
          logout();
        } else {
          showSnackNotificationPopup({ status: 'FAILED', text: error.message });
        }
      })
      .finally(() => {
        setUploading(false);
      });
  };

  const handleDownloadFile = (file) => {
    const match = file.fileUrl.match(/\/subjects\/(\d+)\/files\/(\d+)/);
    if (!match) {
      showSnackNotificationPopup({ status: 'FAILED', text: 'Invalid file URL.' });
      return;
    }
    const subjectId = match[1];
    const fileId = match[2];
    setDownloadingFileId(fileId);
    getFile(subjectId, fileId, false, { responseType: 'blob' })
      .then((response) => {
        let filename = file.fileName;
        const disposition = response.headers && response.headers['content-disposition'];
        if (disposition) {
          const matchFilename = disposition.match(/filename\*?=(?:UTF-8'')?([^;]+)/i);
          if (matchFilename && matchFilename[1]) {
            try {
              filename = decodeURIComponent(matchFilename[1].replace(/['"]/g, ''));
            } catch {
              filename = matchFilename[1].replace(/['"]/g, '');
            }
          }
        }
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch(() => {
        showSnackNotificationPopup({ status: 'FAILED', text: 'Failed to download file.' });
      })
      .finally(() => {
        setDownloadingFileId(null);
      });
  };

  return (
    <div className={styles.container}>
      {data ? (
        <div className={styles.content}>
          <div className={styles.topSection}>
            <div className={styles.leftInfo}>
              <h1 className={styles.subjectName}>{data.name}</h1>
              <p className={styles.description}>{data.description}</p>
            </div>
          </div>
          <div className={styles.sectionsWrapper}>
            <div className={styles.section}>
              <h2>Lecturers</h2>
              <div className={styles.lecturers}>
                {Object.keys(data.lecturers).map((category) => (
                  <div key={category}>
                    <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
                    <ul>
                      {data.lecturers[category].map((lecturer, index) => (
                        <li key={index} onClick={() => handleNavigate(lecturer.id)}>
                          {lecturer.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.section}>
              <h2>Files and Conspects</h2>
              <div className={styles.fileUpload}>
                <input
                  type="file"
                  id="fileInput"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                  disabled={uploading}
                />
                <label htmlFor="fileInput" className={styles.uploadButton}>
                  {uploading ? 'Uploading...' : 'Upload File'}
                </label>
              </div>
              <ul className={styles.fileList}>
                {data.files && data.files.length > 0 ? (
                  data.files.map((file, idx) => {
                    const fileId = file.fileUrl.match(/\/subjects\/\d+\/files\/(\d+)/)?.[1];
                    const isLoading = downloadingFileId === fileId;
                    return (
                      <li key={idx} className={styles.fileItem}>
                        <button
                          className={styles.downloadButton}
                          onClick={() => handleDownloadFile(file)}
                          type="button"
                          disabled={isLoading}
                        >
                          {isLoading && <span className={styles.downloadSpinner}></span>}
                          {isLoading ? 'Downloading...' : file.fileName}
                        </button>
                      </li>
                    );
                  })
                ) : (
                  <div className={styles.placeholder}>No files uploaded yet.</div>
                )}
              </ul>
            </div>

            <div className={styles.section}>
              <h2>Reviews</h2>
              <ul className={styles.reviewList}>
                {reviews &&
                  reviews.map((review, index) => (
                    <li key={index} className={styles.reviewItem}>
                      <strong>{review.name}:</strong> {review.review}
                    </li>
                  ))}
              </ul>
              <div className={styles.newReview}>
                <textarea
                  className={styles.textarea}
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  placeholder="Write your review here..."
                />
                <button className={styles.addButton} onClick={handleAddReview}>
                  Add Review
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.loader}>
          <Loader />
        </div>
      )}
    </div>
  );
};

export default Subject;
