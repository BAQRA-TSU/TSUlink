import { useContext, useEffect, useState } from 'react';
import styles from './Home.module.css';
import { useNavigate } from 'react-router-dom';
import { getCategories } from '../../Services/common';
import Loader from '../../Components/loader/Loader';
import { UserContext } from '../../Services/userContext';
import { useNotificationPopup } from '../../Services/notificationPopupProvider';

const Home = () => {
  const history = useNavigate();
  const [openCourse, setOpenCourse] = useState(null);
  const [openSemester, setOpenSemester] = useState(null);
  const [data, setData] = useState();
  const { logout } = useContext(UserContext);
  const { showSnackNotificationPopup } = useNotificationPopup();

  useEffect(() => {
    const cachedData = sessionStorage.getItem(`categories`);
    if (cachedData) {
      setData(JSON.parse(cachedData));
    } else {
      getCategories()
        .then((res) => {
          setData(res);
          sessionStorage.setItem(`categories`, JSON.stringify(res));
        })
        .catch((error) => {
          if (error.message === 'UNAUTHORIZED') {
            logout();
          } else {
            showSnackNotificationPopup({ status: 'FAILED', text: error.message });
          }
        });
    }
  }, []);

  const handleNavigate = (item) => {
    history(`/subject/?name=${item}`);
  };

  return (
    <div className={styles.gamesContainer}>
      {data ? (
        data.map((course, courseIndex) => (
          <div key={courseIndex} className={styles.courseContainer}>
            <button
              onClick={() => {
                setOpenCourse(openCourse === courseIndex ? null : courseIndex);
                setOpenSemester(null);
              }}
              className={styles.courseButton}
            >
              {course.course}
            </button>
            {openCourse === courseIndex && (
              <div className={styles.semesterContainer}>
                {course.semesters.map((semester, semesterIndex) => (
                  <div key={semesterIndex}>
                    <button
                      onClick={() => setOpenSemester(openSemester === semesterIndex ? null : semesterIndex)}
                      className={styles.semesterButton + ' ' + styles[semesterIndex % 2 === 0 ? 'even' : 'odd']}
                    >
                      {semester.name}
                    </button>
                    {openSemester === semesterIndex && (
                      <ul className={styles.itemList}>
                        {semester.items.map((item, itemIndex) => (
                          <li
                            key={itemIndex}
                            onClick={() => handleNavigate(item.shortName)}
                            className={styles.item + ' ' + styles[semesterIndex % 2 === 0 ? 'even' : 'odd']}
                          >
                            {item.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      ) : (
        <div className={styles.loader}>
          <Loader />
        </div>
      )}
    </div>
  );
};

export default Home;
