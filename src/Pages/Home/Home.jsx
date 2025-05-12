import { useState } from 'react';
import styles from './Home.module.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const history = useNavigate();
  const data = [
    {
      course: 'კურსი 1',
      semesters: [
        {
          name: 'სემესტრი 1',
          items: [
            { name: 'დაპროგრამების საფუძვლები', shortName: 'programming-basics' },
            { name: 'ინგლისური ენა B 1.1', shortName: 'english-b1-1' },
            { name: 'კალკულუსი II', shortName: 'calculus-2' },
            { name: 'კომპიუტერული (ICT) წიგნიერება', shortName: 'ict-literacy' },
          ],
        },
        {
          name: 'სემესტრი 2',
          items: [
            { name: 'დისკრეტული სტრუქტურები', shortName: 'discrete-structures' },
            { name: 'ინგლისური ენა B 1.2', shortName: 'english-b1-2' },
            { name: 'კალკულუსი კომპიუტერული მეცნიერებისათვის', shortName: 'calculus-for-cs' },
            { name: 'მონაცემთა სტრუქტურები', shortName: 'data-structures' },
          ],
        },
      ],
    },
    {
      course: 'კურსი 2',
      semesters: [
        {
          name: 'სემესტრი 1',
          items: [
            { name: 'გეოგრაფიის შესავალი', shortName: 'intro-to-geography' },
            { name: 'ინგლისური ენა 3 (ტექნიკური ინგლისური)', shortName: 'technical-english-3' },
            { name: 'კომპიუტერის არქიტექტურა და ორგანიზაცია', shortName: 'computer-architecture' },
          ],
        },
        {
          name: 'სემესტრი 2',
          items: [
            { name: 'ვებ დაპროგრამება', shortName: 'web-programming' },
            { name: 'კალკულუსი კომპიუტერული მეცნიერებისათვის', shortName: 'calculus-for-cs' },
            { name: 'მონაცემთა ბაზები', shortName: 'databases' },
          ],
        },
      ],
    },
    {
      course: 'კურსი 3',
      semesters: [
        {
          name: 'სემესტრი 1',
          items: [
            { name: 'მანქანური სწავლება', shortName: 'machine-learning' },
            { name: 'პროგრამული უზრუნველყოფის ინჟინერია', shortName: 'software-engineering' },
            { name: 'საქართველოს ახალი და უახლეს ისტორიის საკითხები', shortName: 'georgia-history' },
            { name: 'სისტემათა ადმინისტრირება და მართვა', shortName: 'system-administration' },
          ],
        },
        {
          name: 'სემესტრი 2',
          items: [
            { name: 'მათემატიკური დაპროგრამება', shortName: 'mathematical-programming' },
            { name: 'პროგრამული უზრუნველყოფის ინჟინერია', shortName: 'software-engineering' },
            { name: 'სისტემების არქიტექტურა', shortName: 'system-architecture' },
            { name: 'ტექნიკური ინგლისური II', shortName: 'technical-english-2' },
          ],
        },
      ],
    },
    {
      course: 'კურსი 4',
      semesters: [
        {
          name: 'სემესტრი 1',
          items: [
            { name: 'მათემატიკური ლოგიკა', shortName: 'mathematical-logic' },
            { name: 'პროგრამული უზრუნველყოფის ინჟინერია', shortName: 'software-engineering' },
            { name: 'სისტემების არქიტექტურა', shortName: 'system-architecture' },
            { name: 'ტექნიკური ინგლისური II', shortName: 'technical-english-2' },
          ],
        },
        {
          name: 'სემესტრი 2',
          items: [
            { name: 'Java Script - დინამიური WEB გვერდების პროგრამირება', shortName: 'javascript-web' },
            { name: 'პროგრამული უზრუნველყოფის ინჟინერია', shortName: 'software-engineering' },
            { name: 'სისტემების არქიტექტურა', shortName: 'system-architecture' },
            { name: 'ტექნიკური ინგლისური II', shortName: 'technical-english-2' },
          ],
        },
      ],
    },
  ];

  const [openCourse, setOpenCourse] = useState(null);
  const [openSemester, setOpenSemester] = useState(null);

  const handleNavigate = (item) => {
    history(`/subject/?name=${item}`);
  };

  return (
    <div className={styles.gamesContainer}>
      {data.map((course, courseIndex) => (
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
                    className={styles.semesterButton}
                  >
                    {semester.name}
                  </button>
                  {openSemester === semesterIndex && (
                    <ul className={styles.itemList}>
                      {semester.items.map((item, itemIndex) => (
                        <li key={itemIndex} onClick={() => handleNavigate(item.shortName)} className={styles.item}>
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
      ))}
    </div>
  );
};

export default Home;
