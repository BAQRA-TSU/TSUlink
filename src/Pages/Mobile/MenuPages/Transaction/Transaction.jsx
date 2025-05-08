import { useContext, useEffect, useRef, useState } from 'react';
import styles from './Transaction.module.css';
import { useNavigate } from 'react-router-dom';
import { TransactionsIcon, RightArrow, BackIcon, ClockClose } from '../../../../assets/svg/svg';
import { useTranslation } from 'react-i18next';
import MobileHeaderLogo from '../../../../Components/Mobile/MobilHeaderLogo/MobileHeaderLogo';
import Popup from '../../../../Components/Mobile/Popup/Popup';
import ProvidersComponent from '../../../../Components/Mobile/Providers/Providers';
import { getOneTransaction, getTransactions } from '../../../../Services/common';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Loader from '../../../../assets/images/loader-setanta.json';
import { UserContext } from '../../../../Services/userContext';
import TransactionDetails from '../../../../Components/Mobile/TransactionDetails/TransactionDetails';
import { useNotificationPopup } from '../../../../Services/notificationPopupProvider';
import DateFilter from '../../../../Components/Mobile/DateFilter/DateFilter';

const Transactions = () => {
  const { t } = useTranslation();
  let history = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [isProviderPopupVisible, setIsProviderPopupVisible] = useState(false);
  const [isDatePopupVisible, setIsDatePopupVisible] = useState(false);
  const [isDetailedVisible, setIsDetailedVisible] = useState(false);
  const [providerSortTypes, setProviderSortTypes] = useState([]);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [showData, setShowData] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [detailedData, setDetailedData] = useState(true);
  const { wallet } = useContext(UserContext);
  const MonthArray = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const { showSnackNotificationPopup } = useNotificationPopup();
  const { logout } = useContext(UserContext);
  const scrollRef = useRef();
  const [loadTransactionNumber, setLoadTransactionNumber] = useState(20);
  const [isFilteredByDate, setIsFilteredByDate] = useState(false);
  const [isFilteredByProvider, setIsFilteredByProvider] = useState(false);

  function filterByDate(startDate, endDate) {
    setStartDate(startDate);
    setEndDate(endDate);
    scrollRef.current.scrollTo(0, 1);
    setLoadTransactionNumber(20);
    setIsFilteredByDate(true);
    setIsDatePopupVisible(false);
    getTransactions(0, 20, activeTab === 0 ? 'FINANCIAL' : 'GAME', startDate, endDate) //props.categoryName
      .then((resp) => {
        if (resp === false) {
          showSnackNotificationPopup({ status: 'FAILED', text: 'Transactions fetch failed' });
          setShowData(null);
          return;
        }
        setShowData(resp.transactions);
        setTotalCount(resp.total);
      })
      .catch((error) => {
        if (error.message === 'UNAUTHORIZED') {
          logout();
        } else {
          showSnackNotificationPopup({ status: 'FAILED', text: t(error.message) });
          setShowData(null);
        }
      })
      .finally(() => {
        setTransactionsLoading(false);
      });
  }

  function filterByProvider(providers) {
    scrollRef.current.scrollTo(0, 1);
    setLoadTransactionNumber(20);
    setIsProviderPopupVisible(false);
    setIsFilteredByProvider(true);
    setProviderSortTypes(providers);
    getTransactions(
      0,
      20,
      activeTab === 0 ? 'FINANCIAL' : 'GAME',
      isFilteredByDate && startDate,
      isFilteredByDate && endDate,
      providers
    ) //props.categoryName
      .then((resp) => {
        if (resp === false) {
          showSnackNotificationPopup({ status: 'FAILED', text: 'Transactions fetch failed' });
          setShowData(null);
          return;
        }
        setShowData(resp.transactions);
        setTotalCount(resp.total);
      })
      .catch((error) => {
        if (error.message === 'UNAUTHORIZED') {
          logout();
        } else {
          showSnackNotificationPopup({ status: 'FAILED', text: t(error.message) });
          setShowData(null);
        }
      })
      .finally(() => {
        setTransactionsLoading(false);
      });
  }

  useEffect(() => {
    setTransactionsLoading(true);
    getTransactions(0, 20, activeTab === 0 ? 'FINANCIAL' : 'GAME') //props.categoryName
      .then((resp) => {
        if (resp === false) {
          showSnackNotificationPopup({ status: 'FAILED', text: 'Transactions fetch failed' });
          setShowData(null);
          return;
        }
        setShowData(resp.transactions);
        // setData(response.data.games.filter((game) => storedProviderSort.includes(game.provider)));
        setTotalCount(resp.total);
      })
      .catch((error) => {
        if (error.message === 'UNAUTHORIZED') {
          logout();
        } else {
          showSnackNotificationPopup({ status: 'FAILED', text: t(error.message) });
          setShowData(null);
        }
      })
      .finally(() => {
        setTransactionsLoading(false);
      });
  }, [activeTab]);

  useEffect(() => {
    const wrapperElement = scrollRef.current;
    const handleEvent = (event) => {
      if (Math.round(event.target.scrollTop + event.target.offsetHeight) + 5 >= Math.round(event.target.scrollHeight)) {
        const newLoadingGameNumber = loadTransactionNumber + 20;
        if (newLoadingGameNumber < totalCount - 1) {
          // setTransactionsLoading(true);
          getTransactions(
            loadTransactionNumber,
            newLoadingGameNumber,
            activeTab === 0 ? 'FINANCIAL' : 'GAME',
            isFilteredByDate && startDate,
            isFilteredByDate && endDate,
            isFilteredByProvider && providerSortTypes
          ) //props.categoryName
            .then((resp) => {
              if (resp === false) {
                showSnackNotificationPopup({ status: 'FAILED', text: 'Transactions fetch failed' });
                setShowData(null);
                return;
              }
              setShowData([...showData, ...resp.transactions]);
              // setData(response.data.games.filter((game) => storedProviderSort.includes(game.provider)));
            })
            .catch((error) => {
              if (error.message === 'UNAUTHORIZED') {
                logout();
              } else {
                showSnackNotificationPopup({ status: 'FAILED', text: t(error.message) });
              }
            })
            .finally(() => {
              // setTransactionsLoading(false);
            });
          // setShowData([
          // 	...showData,
          // 	...data.slice(loadTransactionNumber, newLoadingGameNumber),
          // ]);
        } else if (loadTransactionNumber <= totalCount) {
          getTransactions(
            loadTransactionNumber,
            totalCount,
            activeTab === 0 ? 'FINANCIAL' : 'GAME',
            isFilteredByDate && startDate,
            isFilteredByDate && endDate
          ) //props.categoryName
            .then((resp) => {
              if (resp === false) {
                showSnackNotificationPopup({ status: 'FAILED', text: 'Transactions fetch failed' });
                setShowData(null);
                return;
              }
              setShowData([...showData, ...resp.transactions]);
              // setData(response.data.games.filter((game) => storedProviderSort.includes(game.provider)));
            })
            .catch((error) => {
              if (error.message === 'UNAUTHORIZED') {
                logout();
              } else {
                showSnackNotificationPopup({ status: 'FAILED', text: t(error.message) });
              }
            })
            .finally(() => {
              // setTransactionsLoading(false);
            });
          // setShowData([
          // 	...showData,
          // 	...data.slice(loadTransactionNumber, totalCount),
          // ]);
        }
        setLoadTransactionNumber(newLoadingGameNumber);
      }
    };
    wrapperElement.addEventListener('scroll', handleEvent);
    return () => wrapperElement.removeEventListener('scroll', handleEvent);
  }, [showData]);

  function showOne(id) {
    getOneTransaction(id)
      .then((resp) => {
        if (resp === false) {
          showSnackNotificationPopup({ status: 'FAILED', text: 'Transaction fetch failed' });
          return;
        }
        setDetailedData(resp);
        setIsDetailedVisible(true);
      })
      .catch((error) => {
        if (error.message === 'UNAUTHORIZED') {
          logout();
        } else {
          showSnackNotificationPopup({ status: 'FAILED', text: t(error.message) });
        }
      });
  }

  return (
    <div className={styles.transactionWrapper}>
      <div className={styles.transactionComponent}>
        <div className={styles.transactionHeader}>
          <div
            onClick={() => {
              history('/menu');
            }}
          >
            <BackIcon />
          </div>
          <MobileHeaderLogo />
          <div className={styles.filler} />
        </div>
        <h1 className={styles.categoryTitle}>{t('transaction.history')}</h1>
        <header className={styles.switchContainer}>
          <div
            onClick={() => setActiveTab(0)}
            className={styles.switchContainerElement + (activeTab === 0 ? ' ' + styles.active : '')}
          >
            {t('financial')}
          </div>
          <div
            onClick={() => setActiveTab(1)}
            className={styles.switchContainerElement + (activeTab === 1 ? ' ' + styles.active : '')}
          >
            {t('games')}
          </div>
        </header>
        <div ref={scrollRef} className={styles.transactionListOuter}>
          <div className={styles.transactionList}>
            {showData && wallet && !transactionsLoading && showData.length > 0 ? (
              showData.map((item) => (
                <>
                  <div className={styles.categoryDescription}>
                    {new Date(item.date).getDate() + ' ' + MonthArray[new Date(item.date).getMonth()]}
                  </div>
                  {item.transactions.map((item) => (
                    <div
                      className={styles.categoryItem}
                      key={item.id}
                      onClick={() => {
                        activeTab === 1 && showOne(item.sessionId);
                      }}
                    >
                      <div className={styles.categoryItemLeft}>
                        <div className={styles.categoryHeader}>
                          {' '}
                          {activeTab === 0 && t(item.totalAmount > 0 ? 'deposit' : 'withdrawal') + ': '} {item.provider}
                          {activeTab === 1 && ': ' + item.gameName}
                        </div>
                        <div className={styles.categoryFooter}>
                          {activeTab === 0
                            ? t(item.status)
                            : ('0' + new Date(item.start).getHours()).slice(-2) +
                              ':' +
                              ('0' + new Date(item.start).getMinutes()).slice(-2) +
                              '-' +
                              (('0' + new Date(item.end).getHours()).slice(-2) +
                                ':' +
                                ('0' + new Date(item.end).getMinutes()).slice(-2))}
                        </div>
                      </div>
                      <div className={styles.categoryItemRight}>
                        <div className={styles.categoryItemRightInner}>
                          <div className={styles.categoryHeader}>
                            {activeTab === 0
                              ? item.totalAmount + ' ' + wallet.currencySymbol
                              : item.totalWinAmount + ' ' + wallet.currencySymbol}
                          </div>
                          <div className={styles.categoryFooter}>
                            {activeTab === 0
                              ? t('fee') + ': ' + item.feeAmount + ' ' + wallet.currencySymbol
                              : t('bet') +
                                ': ' +
                                Math.abs(item.totalBetAmount).toFixed(2) +
                                ' ' +
                                wallet.currencySymbol}
                          </div>
                        </div>
                        {activeTab === 1 && <RightArrow color={'#646464'} />}
                      </div>
                    </div>
                  ))}
                </>
              ))
            ) : (
              <div className={styles.noResultContainer}>
                {transactionsLoading ? (
                  <DotLottieReact data={Loader} loop={true} autoplay={true} className={styles.loader} />
                ) : (
                  <>
                    <div className={styles.noData}>
                      <span className={styles.noDataIcon}>
                        <ClockClose />
                      </span>
                      <p className={styles.noDataText}>{t('no.result.found')}</p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={styles.filters}>
        <div className={styles.filtersItem} onClick={() => setIsDatePopupVisible(true)}>
          <TransactionsIcon />
          <p className={styles.filtersText}>{t('time.filter')}</p>
        </div>
        {activeTab === 1 && (
          <div className={styles.filtersItem} onClick={() => setIsProviderPopupVisible(true)}>
            <p className={styles.filtersText}>{t('providers')}</p>
          </div>
        )}
      </div>
      {isProviderPopupVisible && (
        <Popup header={'providers'} hidePopup={setIsProviderPopupVisible}>
          <ProvidersComponent
            hidePopup={setIsProviderPopupVisible}
            providerSortTypes={providerSortTypes}
            sortByProvider={filterByProvider}
          />
        </Popup>
      )}
      {isDatePopupVisible && (
        <Popup header={'time.filter'} hidePopup={setIsDatePopupVisible}>
          <DateFilter filterByDate={filterByDate} />
        </Popup>
      )}
      {isDetailedVisible && (
        <Popup header={'details'} hidePopup={setIsDetailedVisible}>
          <TransactionDetails
            detailedData={detailedData}
            setIsDetailedVisible={setIsDetailedVisible}
            activeTab={activeTab}
          />
        </Popup>
      )}
    </div>
  );
};

export default Transactions;
