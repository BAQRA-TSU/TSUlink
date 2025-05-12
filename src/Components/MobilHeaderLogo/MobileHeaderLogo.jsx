import {Link} from "react-router-dom";
import styles from "./MobileHeaderLogo.module.css";

const MobileHeaderLogo = () => {
    return (
        <Link to={"/"} >
            <div className={styles.aviatorLogo}/>
        </Link>
    );
};

export default MobileHeaderLogo;
