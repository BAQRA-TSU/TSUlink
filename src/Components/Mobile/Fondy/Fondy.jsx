import { useEffect, useState } from "react";
import styles from "./Fondy.module.css";
import PropTypes from 'prop-types';

const FONDYPaymentIframe = ({ link }) => {
    const [paymentSession, setPaymentSession] = useState(null);

    useEffect(() => {
        setPaymentSession(link);
    }, [link]);

    return (
        <div className={styles.bogIframe}>
            {/* <h1 className={styles.header}>FONDY modal</h1> */}
            <div className={styles.middleBog}>
                <iframe src={paymentSession} className={styles.iFrame}></iframe>
            </div>
        </div>
    );
};

export default FONDYPaymentIframe;

FONDYPaymentIframe.propTypes = {
    link: PropTypes.string.isRequired // URL link for the payment iframe
};