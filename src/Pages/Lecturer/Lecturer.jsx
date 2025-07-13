import { useContext, useEffect, useState } from 'react';
import styles from './Lecturer.module.css';
import { useNavigate } from 'react-router-dom';
import { deleteLecturer, getLecturer, postLecturer, postLecturerApprove } from '../../Services/common';
import Loader from '../../Components/loader/Loader';
import { UserContext } from '../../Services/userContext';
import { useNotificationPopup } from '../../Services/notificationPopupProvider';
import { useTranslation } from 'react-i18next';

const Lecturer = () => {
  const [t] = useTranslation();
  const [newReview, setNewReview] = useState('');
  const [reviews, setReviews] = useState();
  const [data, setData] = useState();
  const [deletingReviewId, setDeletingReviewId] = useState(null);
  const [addingReview, setAddingReview] = useState(false);
  const [approvingReviewId, setApprovingReviewId] = useState(null);
  const history = useNavigate();
  const { logout } = useContext(UserContext);
  const { showSnackNotificationPopup } = useNotificationPopup();

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const id = urlParams.get('id');

  const navigate = useNavigate();

  if (!id) {
    navigate('/');
  }

  useEffect(() => {
    getLecturer(id)
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
  }, [id]);

  const handleAddReview = () => {
    if (newReview.trim()) {
      setAddingReview(true);
      postLecturer(id, newReview)
        .then((res) => {
          console.log(res);
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

  const handleDeleteReview = (reviewId) => {
    setDeletingReviewId(reviewId);
    deleteLecturer(reviewId)
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
    setApprovingReviewId(reviewId);
    postLecturerApprove(reviewId)
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
      })
      .finally(() => {
        setApprovingReviewId(null);
      });
  };

  const handleNavigate = (id) => {
    history(`/subject/?id=${id}`);
  };

  return (
    <div className={styles.container}>
      {data ? (
        <div className={styles.content}>
          <h1 className={styles.subjectName}>{data.name}</h1>
          <p className={styles.description}>{data.description}</p>

          <div className={styles.section}>
            <h2>{t('lecturer.subjects')}</h2>
            <ul className={styles.subjectList}>
              {data.subjects.map((subject, index) => (
                <li key={index} onClick={() => handleNavigate(subject.id)} className={styles.subjectItem}>
                  {subject.name}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.section}>
            <h2>{t('lecturer.contact.info')}</h2>
            <ul className={styles.contactInfo}>
              <li>
                {t('lecturer.email')}: <a href={`mailto:${data.information.email}`}>{data.information.email}</a>
              </li>
              <li>
                {t('lecturer.phone')}:{' '}
                <a href={`tel:${data.information.phoneNumber}`}>{data.information.phoneNumber}</a>
              </li>
              <li>
                {t('lecturer.office')}: <a>{data.information.office}</a>
              </li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2>{t('lecturer.reviews')}</h2>
            <ul className={styles.reviewList}>
              {reviews &&
                reviews.map((review) => {
                  const isPending = review.status === 'pending' || review.isApproved === false;
                  return (
                    <li key={review.id} className={`${styles.reviewItem} ${isPending ? styles.pending : ''}`}>
                      <div className={styles.review}>
                        <strong>{review.name}:</strong> {review.review}
                      </div>
                      {isPending && <span className={styles.pendingText}>{t('waiting.admin.approval')}</span>}
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
                          <button
                            className={styles.approveButton}
                            onClick={() => handleApproveReview(review.id)}
                            disabled={approvingReviewId === review.id}
                          >
                            {approvingReviewId === review.id && <span className={styles.downloadSpinner}></span>}
                            {t('approve')}
                          </button>
                        )}
                      </div>
                    </li>
                  );
                })}
            </ul>
            <div className={styles.newReview}>
              <textarea
                className={styles.textarea}
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                placeholder={t('lecturer.write.review')}
              />
              <button className={styles.addButton} onClick={handleAddReview} disabled={addingReview}>
                {addingReview && <span className={styles.downloadSpinner}></span>}
                {addingReview ? t('adding.review') : t('add.review')}
              </button>
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

export default Lecturer;
