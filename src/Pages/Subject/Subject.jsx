import { useContext, useEffect, useState } from 'react';
import styles from './Subject.module.css';
import { useNavigate } from 'react-router-dom';
import {
  getSubject,
  postSubject,
  postFile,
  getFile,
  postSubjectApprove,
  deleteSubjectReview,
} from '../../Services/common';
import Loader from '../../Components/loader/Loader';
import { UserContext } from '../../Services/userContext';
import { useNotificationPopup } from '../../Services/notificationPopupProvider';
import { useTranslation } from 'react-i18next';

const Subject = () => {
  const [t] = useTranslation();
  const [newReview, setNewReview] = useState('');
  const [reviews, setReviews] = useState();
  const [data, setData] = useState();
  const [uploading, setUploading] = useState(false);
  const [downloadingFileId, setDownloadingFileId] = useState(null);
  const [addingReview, setAddingReview] = useState(false);
  const [deletingReviewId, setDeletingReviewId] = useState(null);
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
      setAddingReview(true);
      postSubject(id, newReview)
        .then((res) => {
          setReviews([
            ...reviews,
            {
              name: res.name,
              review: res.review,
              canDelete: res.canDelete,
              id: res.id,
              status: res.status,
              isApproved: res.isApproved,
            },
          ]);
          setNewReview('');
        })
        .catch((error) => {
          if (error.message === 'UNAUTHORIZED') {
            logout();
          } else {
            showSnackNotificationPopup({ status: 'FAILED', text: error.message });
          }
        })
        .finally(() => {
          setAddingReview(false);
        });
    }
  };

  const handleNavigate = (item) => {
    history(`/lecturer/?id=${item}`);
  };

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

  const handleDeleteReview = (reviewId) => {
    setDeletingReviewId(reviewId);
    deleteSubjectReview(reviewId)
      .then(() => {
        setReviews(reviews.filter((review) => review.id !== reviewId));
      })
      .catch((error) => {
        if (error.message === 'UNAUTHORIZED') {
          logout();
        } else {
          showSnackNotificationPopup({ status: 'FAILED', text: error.message });
        }
      })
      .finally(() => {
        setDeletingReviewId(null);
      });
  };

  const handleApproveReview = (reviewId) => {
    postSubjectApprove(reviewId)
      .then(() => {
        setReviews(
          reviews.map((review) =>
            review.id === reviewId ? { ...review, isApproved: true, status: 'approved' } : review
          )
        );
      })
      .catch((error) => {
        if (error.message === 'UNAUTHORIZED') {
          logout();
        } else {
          showSnackNotificationPopup({ status: 'FAILED', text: error.message });
        }
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
              <h2>{t('subject.lecturers')}</h2>
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
              <h2>{t('subject.files')}</h2>
              <div className={styles.fileUpload}>
                <input
                  type="file"
                  id="fileInput"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                  disabled={uploading}
                />
                <label htmlFor="fileInput" className={styles.uploadButton}>
                  {uploading ? t('subject.uploading') : t('subject.upload.file')}
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
                          {isLoading ? t('subject.downloading') : file.fileName}
                        </button>
                      </li>
                    );
                  })
                ) : (
                  <div className={styles.placeholder}>{t('subject.no.files')}</div>
                )}
              </ul>
            </div>

            <div className={styles.section}>
              <h2>{t('subject.reviews')}</h2>
              <ul className={styles.reviewList}>
                {reviews &&
                  reviews.map((review) => (
                    <li
                      key={review.id}
                      className={`${styles.reviewItem} ${
                        review.status === 'pending' || review.isApproved === false ? styles.pending : ''
                      }`}
                    >
                      <div className={styles.review}>
                        <strong>{review.name}:</strong> <div className={styles.text}>{review.review}</div>
                      </div>
                      {(review.status === 'pending' || review.isApproved === false) && (
                        <span className={styles.pendingText}>{t('waiting.admin.approval')}</span>
                      )}
                      <div className={styles.buttons}>
                        {review.canDelete && (
                          <button
                            className={styles.deleteButton}
                            onClick={() => handleDeleteReview(review.id)}
                            disabled={deletingReviewId === review.id}
                          >
                            {deletingReviewId === review.id && <span className={styles.downloadSpinner}></span>}
                            {t('delete')}
                          </button>
                        )}
                        {review.isApproved === false && (
                          <button className={styles.approveButton} onClick={() => handleApproveReview(review.id)}>
                            {t('approve')}
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
              </ul>
              <div className={styles.newReview}>
                <textarea
                  className={styles.textarea}
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  placeholder={t('subject.write.review')}
                />
                <button className={styles.addButton} onClick={handleAddReview} disabled={addingReview}>
                  {addingReview && <span className={styles.downloadSpinner}></span>}
                  {addingReview ? t('adding.review') : t('add.review')}
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
