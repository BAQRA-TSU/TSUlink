import {Link} from "react-router-dom";
import styles from "./MobileHeaderLogo.module.css";

const MobileHeaderLogo = () => {
    return (
        <Link to={"/"} >
            <div className={styles.tsuLinkLogo}/>
        </Link>
    );
};

export default MobileHeaderLogo;
