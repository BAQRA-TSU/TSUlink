import { useContext } from "react";
import styles from "./cashbackCard.module.css";
import { UserContext } from "../../../../../Services/userContext";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { CheckIcon } from "../../../../../assets/svg/svg";

const CashbackCard = ({ cardType, proccent, isCurrent, maxPoint }) => {
  const [t] = useTranslation();
  const { wallet } = useContext(UserContext);

  return (
    <div className={styles.cashbackCard}>
      {isCurrent && <span className={styles.current}>{t('current')}</span>}
      <div className={styles.cashbackHeader}>
        <div className={styles.cachbackLeft}>
          <h1 className={styles.cachbackLeftHeader}>{t(cardType)}</h1>
          <p className={styles.cachbackLeftDescription}>Bet {maxPoint}{wallet && wallet.currencySymbol} or more</p>
        </div>
        <p className={styles.proccent}>{proccent}%</p>
      </div>
      <div className={styles.cashbackBenefits}>
        <div className={styles.cashbackBenefit}>
          <span className={styles.check}><CheckIcon/></span>
          <p className={styles.cashbackBenefitText}>Veli.Store Voucher</p>
        </div>
        <div className={styles.cashbackBenefit}>
          <span className={styles.check}><CheckIcon/></span>
          <p className={styles.cashbackBenefitText}>Veli.Store Voucher</p>
        </div>
        <div className={styles.cashbackBenefit}>
          <span className={styles.check}><CheckIcon/></span>
          <p className={styles.cashbackBenefitText}>Veli.Store Voucher</p>
        </div>
        <div className={styles.cashbackBenefit}>
          <span className={styles.check}><CheckIcon/></span>
          <p className={styles.cashbackBenefitText}>Veli.Store Voucher</p>
        </div>
      </div>
      <img className={styles.cardIcon} src={`./loyalty/${cardType}.png`} />
    </div>
  );
};

export default CashbackCard;

CashbackCard.propTypes = {
  cardType: PropTypes.string.isRequired,
  proccent: PropTypes.number.isRequired,
  maxPoint: PropTypes.number.isRequired,
  isCurrent: PropTypes.bool
};