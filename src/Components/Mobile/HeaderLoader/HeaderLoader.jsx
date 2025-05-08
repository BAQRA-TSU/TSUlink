import PropTypes from "prop-types";
import styles from './HeaderLoader.module.css'

const CircularProgress = ({ imgSrc, progress }) => {
    return (
        <div
            className={styles.progressContainer}
            style={{ "--progress": `${progress}%` }}
        >
            <div className={styles.progressCircle}></div>
            <div className={styles.imageWrapper}>
                <img src={imgSrc} className={styles.progressImage} />
            </div>
        </div>
    );
};

// PropTypes validation
CircularProgress.propTypes = {
    progress: PropTypes.number.isRequired,
    imgSrc: PropTypes.string.isRequired,
    size: PropTypes.number,
    strokeWidth: PropTypes.number
};

export default CircularProgress;