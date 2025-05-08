import styles from './TransactionDetails.module.css'
import { UserContext } from "../../../Services/userContext"
import { useContext } from "react"
import PropTypes from "prop-types";

const TransactionDetails = ({detailedData}) => {
    const { wallet } = useContext(UserContext);

    return (
        detailedData && detailedData.map((item,index) => (
            <div key={index} className={styles.transactionDetails}>
                <div className={styles.categoryItemDetails}>
                    <div className={styles.categoryItemLeft}>
                        <div className={styles.categoryHeader}>{item.provider}</div>
                        <div className={styles.categoryFooter}>{ ('0' + new Date (item.createdAt).getHours()).slice(-2)  + ":" + ('0' + new Date (item.createdAt).getMinutes()).slice(-2) + ":" + ('0' + new Date (item.createdAt).getSeconds()).slice(-2)}</div>
                    </div>
                    <div className={styles.categoryItemRight}>
                        <div className={styles.categoryItemRightInner}>
                        <div className={styles.categoryHeader}>{item.totalAmount + " " + wallet.currencySymbol}</div>
                        {/* <div className={styles.categoryFooter}>{item.winAmount + " " + wallet.currencySymbol}</div> */}
                        </div>
                    </div>
                </div>
            </div>
        ))
    )
}

export default TransactionDetails;

TransactionDetails.propTypes = {
    detailedData: PropTypes.array.isRequired
};