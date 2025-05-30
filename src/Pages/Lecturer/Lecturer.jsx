import { useContext, useEffect, useState } from 'react';
import styles from './Lecturer.module.css';
import { useNavigate } from 'react-router-dom';
import { getLecturer, postLecturer } from '../../Services/common';
import Loader from '../../Components/loader/Loader';
import { UserContext } from '../../Services/userContext';
import { useNotificationPopup } from '../../Services/notificationPopupProvider';

const Lecturer = () => {
  const [newReview, setNewReview] = useState('');
  const [reviews, setReviews] = useState();
  const [data, setData] = useState();
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
      postLecturer(id, newReview)
        .then((res) => {
          console.log(res);
          setReviews([...reviews, { name: 'Anonymous', review: newReview }]);
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
    history(`/subject/?name=${item}`);
  };

  return (
    <div className={styles.container}>
      {data ? (
        <div className={styles.content}>
          <h1 className={styles.subjectName}>{data.name}</h1>
          <p className={styles.description}>{data.description}</p>

          <div className={styles.section}>
            <h2>Subjects</h2>
            <ul className={styles.subjectList}>
              {data.subjects.map((subject, index) => (
                <li key={index} onClick={() => handleNavigate(subject.shortName)} className={styles.subjectItem}>
                  {subject.name}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.section}>
            <h2>Contact Information</h2>
            <ul className={styles.contactInfo}>
              <li>
                Email: <a href={`mailto:${data.information.email}`}>{data.information.email}</a>
              </li>
              <li>
                Phone: <a href={`tel:${data.information.phoneNumber}`}>{data.information.phoneNumber}</a>
              </li>
              <li>Office: <a>{data.information.office}</a></li>
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
      ) : (
        <div className={styles.loader}>
          <Loader />
        </div>
      )}
    </div>
  );
};

export default Lecturer;
