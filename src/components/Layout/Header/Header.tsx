import styles from "./Header.module.css";
import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <>
      {
        <header className={styles.header}>
          <div className={styles.headerWrapper}>
            <NavLink to={"/login"} className={styles.signIn}>
              <div className={styles.signInText}>Sign In</div>
            </NavLink>
          </div>
        </header>
      }
    </>
  );
};

export default Header;
