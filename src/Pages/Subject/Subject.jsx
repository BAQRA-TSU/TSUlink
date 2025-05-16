import { useEffect, useState } from 'react';
import styles from './Subject.module.css';
import { useNavigate } from 'react-router-dom';
import { getSubject } from '../../Services/common';

const Subject = () => {
  const [newReview, setNewReview] = useState('');
  const [reviews, setReviews] = useState();
  const [data, setData] = useState();

  const history = useNavigate();

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const name = urlParams.get('name');

  const navigate = useNavigate();

  if (!name) {
    navigate('/');
  }

  useEffect(() => {
    getSubject(name)
      .then((res) => {
        setData(res);
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [name]);

  const handleAddReview = () => {
    if (newReview.trim()) {
      setReviews([...reviews, { name: 'Anonymous', review: newReview }]);
      setNewReview('');
    }
  };

  const handleNavigate = (item) => {
    history(`/lecturer/?id=${item}`);
  };

  return (
    <div className={styles.container}>
      {data && (
        <div className={styles.content}>
          <h1 className={styles.subjectName}>{data.name}</h1>
          <p className={styles.description}>{data.description}</p>
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
            <div className={styles.placeholder}>[Placeholder for files/conspects]</div>
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
      )}
    </div>
  );
};

export default Subject;
