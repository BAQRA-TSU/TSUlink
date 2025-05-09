import { useContext, useEffect, useRef, useState } from "react";
import styles from "./history.module.css";
import { UserContext } from "../../../../../Services/userContext";
import { useTranslation } from "react-i18next";
import { ClockClose, TransactionsIcon } from "../../../../../assets/svg/svg";
import PropTypes from "prop-types";
import { getLoyaltyTransactions } from "../../../../../Services/common";
import { useNotificationPopup } from "../../../../../Services/notificationPopupProvider";


const History = ({ setFilterByDate, setIsDatePopupVisible }) => {
  const [t] = useTranslation();
  const { wallet } = useContext(UserContext);
  const [historyLoading, setHistoryLoading] = useState(false);
  const MonthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const scrollRef = useRef();
  const [loadTransactionNumber, setLoadTransactionNumber] = useState(20);
  const [isFilteredByDate, setIsFilteredByDate] = useState(false);
  const { showSnackNotificationPopup } = useNotificationPopup();
  const [showData, setShowData] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const { logout } = useContext(UserContext);

  useEffect(() => {
    setHistoryLoading(true);
    getLoyaltyTransactions(0, 20) //props.categoryName
      .then((resp) => {
        if (resp === false) {
          showSnackNotificationPopup({ status: "FAILED", text: "Transactions fetch failed" });
          setShowData(null);
          return;
        }
        setShowData(resp.transactions);
        // setData(response.data.games.filter((game) => storedProviderSort.includes(game.provider)));
        setTotalCount(resp.total);
      })
      .catch((error) => {
        if (error.message === "UNAUTHORIZED") {
          logout();
        } else {
          showSnackNotificationPopup({ status: "FAILED", text: t(error.message) });
          setShowData(null);
        }
      })
      .finally(() => {
        setHistoryLoading(false);
      })
  }, [])

  useEffect(() => {
    const filterByDate = (startDate, endDate) => {
      console.log(startDate, endDate);
      setStartDate(startDate);
      setEndDate(endDate);
      scrollRef.current.scrollTo(0, 1);
      setLoadTransactionNumber(20);
      setIsFilteredByDate(true);
      setIsDatePopupVisible(false);
      getLoyaltyTransactions(0, 20, startDate, endDate)
        .then((resp) => {
          if (resp === false) {
            showSnackNotificationPopup({ status: "FAILED", text: "Transactions fetch failed" });
            setShowData(null);
            return;
          }
          setShowData(resp.transactions);
          setTotalCount(resp.total);
        })
        .catch((error) => {
          if (error.message === "UNAUTHORIZED") {
            logout();
          } else {
            showSnackNotificationPopup({ status: "FAILED", text: t(error.message) });
            setShowData(null);
          }
        })
        .finally(() => {
          setHistoryLoading(false);
        })
    };

    setFilterByDate(() => filterByDate);
  }, [setFilterByDate, setIsDatePopupVisible]);


  useEffect(() => {
    const wrapperElement = scrollRef.current;
    const handleEvent = (event) => {
      if (
        (Math.round(
          event.target.scrollTop + event.target.offsetHeight
        ) + 5 >= Math.round(event.target.scrollHeight))
      ) {
        const newLoadingGameNumber = loadTransactionNumber + 20;
        if (newLoadingGameNumber < totalCount - 1) {
          getLoyaltyTransactions(loadTransactionNumber, newLoadingGameNumber, (isFilteredByDate && startDate), (isFilteredByDate && endDate))
            .then((resp) => {
              if (resp === false) {
                showSnackNotificationPopup({ status: "FAILED", text: "Transactions fetch failed" });
                setShowData(null);
                return;
              }
              setShowData([
                ...showData,
                ...resp.transactions
              ]);
            })
            .catch((error) => {
              if (error.message === "UNAUTHORIZED") {
                logout();
              } else {
                showSnackNotificationPopup({ status: "FAILED", text: t(error.message) });
              }
            })
            .finally(() => {
            })
        } else if (loadTransactionNumber <= totalCount) {
          getLoyaltyTransactions(loadTransactionNumber, totalCount, (isFilteredByDate && startDate), (isFilteredByDate && endDate))
            .then((resp) => {
              if (resp === false) {
                showSnackNotificationPopup({ status: "FAILED", text: "Transactions fetch failed" });
                setShowData(null);
                return;
              }
              setShowData([
                ...showData,
                ...resp.transactions
              ]);
            })
            .catch((error) => {
              if (error.message === "UNAUTHORIZED") {
                logout();
              } else {
                showSnackNotificationPopup({ status: "FAILED", text: t(error.message) });
              }
            })
            .finally(() => {
            })
        }
        setLoadTransactionNumber(newLoadingGameNumber);
      }
    };
    wrapperElement.addEventListener("scroll", handleEvent);
    return () => wrapperElement.removeEventListener("scroll", handleEvent);
  }, [showData]);

  return (
    <div className={styles.historyContainer}>
      <div className={styles.historyHeaderContainer}>
        <h1 className={styles.containerHeader}>
          {t("loyalty.history.header")}
        </h1>
        <div className={styles.filtersItem} onClick={() => setIsDatePopupVisible(true)}>
          <TransactionsIcon />
          <p className={styles.filtersText}>{t("time.filter")}</p>
        </div>
      </div>
      <div className={styles.historyWrapper} ref={scrollRef}>
        {showData && wallet && !historyLoading && showData.length > 0 ?
          showData.map((item, index) => (
            <div className={styles.categoryItem} key={index}>
              <div className={styles.categoryItemLeft}>
                <img className={styles.levelCard} src={`./loyalty/${item.metadata.loyalty.loyaltyLvl}.png`} />
                <div className={styles.categoryItemLeftInner}>
                  <div className={styles.categoryHeader}> {t('cashback') + " " + item.metadata.loyalty.cashback + "%"}</div>
                  <div className={styles.categoryFooter}>{t(item.status)}</div>
                </div>
              </div>
              <div className={styles.categoryItemRightInner}>
                <div className={styles.categoryHeader}>{item.totalAmount + " " + wallet.currencySymbol}</div>
                <div className={styles.categoryFooter}>{new Date(item.date).getDate() + " " + MonthArray[new Date(item.date).getMonth()] + ", " + new Date(item.date).getFullYear()}</div>
              </div>
            </div>
          ))
          :
          <div className={styles.noResultContainer}>
            {historyLoading ?
              <>...</>
              :
              <>
                <div className={styles.noData}>
                  <span className={styles.noDataIcon}><ClockClose /></span>
                  <p className={styles.noDataText}>{t("no.result.found")}</p>
                </div>
              </>
            }
          </div>
        }
      </div>
    </div>
  );
};

export default History;

History.propTypes = {
  setFilterByDate: PropTypes.func.isRequired,
  setIsDatePopupVisible: PropTypes.func.isRequired,
};