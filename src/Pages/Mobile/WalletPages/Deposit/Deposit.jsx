import { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import styles from './Deposit.module.css';
import Switch from '../../../../Components/Mobile/Switch/Switch';
import { PostAddNewCard } from '../../../../Services/service';
import {
  GetAccessToken,
  getCard,
  RefreshToken,
  deleteCard,
  addCardSend,
  postWallet,
} from '../../../../Services/common';
import Popup from '../../../../Components/Mobile/Popup/Popup';
import { MasterCardIcon, PlusIcon, VisaIcon } from '../../../../assets/svg/svg';
import BOGPaymentIframe from '../../../../Components/Mobile/BogPay/BogPay';
import Cards from '../../../../Components/Mobile/Cards/Cards';
import { UserContext } from '../../../../Services/userContext';
import { isLogedIn } from '../../../../Services/common';
import WarningPopup from '../../../../Components/Mobile/WarningPopup/WarningPopup';
import Loader from '../../../../assets/images/loader-setanta.json';
import CardTwoFa from '../../../../Components/Mobile/CardTwoFa/CardTwoFa';
import WithdrawDetailsComponent from '../../../../Components/Mobile/WithdrawDetailsComponent/WithdrawDetailsComponent';
import { useNotificationPopup } from '../../../../Services/notificationPopupProvider';

const Deposit = () => {
  const { wallet, setWallet } = useContext(UserContext);
  const [t] = useTranslation();
  const inputRef = useRef();
  const checkboxRef = useRef();
  const location = useLocation();
  const history = useNavigate();
  const [manage, setManage] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  // const [isDepositPopupVisible, setIsDepositPopupVisible] = useState(false);
  const [isWarningVisible, setIsWarningVisible] = useState(false);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [deleteId, setDeleteId] = useState(false);
  const [depositAmount, setDepositAmount] = useState();
  const [selectedCard, setSelectedCard] = useState('0');
  const [orderId, setOrderId] = useState();
  const [payLoading, setPayLoading] = useState(false);
  const [localWallet, setLocalWallet] = useState({ cards: [], currencySymbol: '₾', currceny: 'GEL', balance: 0 });
  const { userData } = useContext(UserContext);
  const [isCardsLoading, SetIsCardsLoading] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [isTwoFaVisible, setIsTwoFaVisible] = useState(false);
  const { showSnackNotificationPopup } = useNotificationPopup();
  const { logout } = useContext(UserContext);

  useEffect(() => {
    if (userData) {
      if (isLogedIn() && !userData.verified) {
        history('/verify');
      }
      if (userData.withdrawalOnlyBlock === true) {
        history('/withdrawal');
      }
    }
  }, [userData]);

  useEffect(() => {
    if (/*isDepositPopupVisible === true ||*/ isTwoFaVisible === true) {
      setPayLoading(false);
    }
  }, [/*isDepositPopupVisible,*/ isTwoFaVisible]);

  useEffect(() => {
    if (wallet) {
      setLocalWallet(wallet);
    }
  }, [wallet]);

  useEffect(() => {
    if (location.pathname === '/game') {
      setShowHeader(false);
    } else {
      setShowHeader(true);
    }
  }, [location]);

  function focusOut(input) {
    input.target.type = 'text';
    const oldInputValue = Number(input.target.value);
    setDepositAmount(oldInputValue);
    const newInput = oldInputValue.toFixed(2);
    if (newInput > 0) {
      input.target.value = newInput + ' ' + localWallet.currencySymbol;
    } else {
      input.target.value = '';
    }
  }

  function addNewCard(otp, save) {
    const accessToken = GetAccessToken();
    if (accessToken) {
      if (depositAmount > 0) {
        setPayLoading(true);
        PostAddNewCard(accessToken, 'BOG', otp, depositAmount, save)
          .then((resp) => {
            setOrderId(resp.data.orderId);
            setIsPopupVisible(true);
          })
          .catch((error) => {
            console.log(error);
            if (error.response && error.response.status === 403) {
              RefreshToken().then((resp) => {
                if (!resp) {
                  logout();
                } else {
                  addNewCard(otp, save);
                }
              });
            } else if (error.response.status === 405) {
              showSnackNotificationPopup({ status: 'FAILED', text: 'Transaction failed' });
              setDepositAmount(0);
              inputRef.current.value = '';
            }
          })
          .finally(() => {
            setPayLoading(false);
          });
      }
    } else {
      logout();
    }
  }

  function selectNewCard() {
    setSelectedCard('0');
  }

  function focusIn(input) {
    input.target.type = 'number';
  }

  function changeInput(input) {
    inputRef.current.type = 'text';
    const num = Number(input.target.attributes.value.value);
    setDepositAmount(num);
    inputRef.current.value = num.toFixed(2) + ' ' + localWallet.currencySymbol;
  }

  function acceptTwoFa(orderId) {
    // addNewCard(code,true);
    if (orderId === 'ERROR') {
      setDepositAmount(0);
      inputRef.current.value = '';
    } else {
      setOrderId(orderId);
      setIsPopupVisible(true);
    }
  }

  function deposit() {
    if (!(depositAmount > 0)) {
      showSnackNotificationPopup({ status: 'FAILED', text: t('deposit.less.than.min') });
      return false;
    }
    if (selectedCard === '0') {
      if (checkboxRef.current.checked) {
        setPayLoading(true);
        addCardSend(userData.id)
          .then((resp) => {
            if (resp === false) {
              showSnackNotificationPopup({ status: 'FAILED', text: 'Phone send failed' });
              return;
            }
            setIsTwoFaVisible(true);
          })
          .catch((error) => {
            switch (error.message) {
              case 'UNAUTHORIZED':
                logout();
                break;
              case 'BLOCKED':
                showSnackNotificationPopup({ status: 'FAILED', text: 'Transaction failed' });
                setDepositAmount(0);
                inputRef.current.value = '';
                break;
              case 'ATTEMPTS_EXCEEDED':
                showSnackNotificationPopup({ status: 'FAILED', text: 'ATTEMPTS_EXCEEDED' });
                break;
              default:
                showSnackNotificationPopup({ status: 'FAILED', text: error.message });
                break;
            }
          })
          .finally(() => {
            setPayLoading(false);
          });
      } else {
        addNewCard(undefined, false);
      }
    } else {
      setPayLoading(true);
      postWallet(depositAmount, 'DEPOSIT', 'BOG', selectedCard)
        .then((resp) => {
          if (resp === false) {
            showSnackNotificationPopup({ status: 'FAILED', text: 'Post Wallet failed' });
            return;
          }
          console.log(resp);

          setOrderId(resp);
          setIsPopupVisible(true);
          setDepositAmount(0);
          inputRef.current.value = '';
        })
        .catch((error) => {
          if (error.message === 'BLOCKED') {
            showSnackNotificationPopup({ status: 'FAILED', text: 'transaction.failed' });
          } else if (error.message === 'UNAUTHORIZED') {
            logout();
          } else {
            showSnackNotificationPopup({ status: 'FAILED', text: error.message });
          }
        })
        .finally(() => {
          setPayLoading(false);
          setDepositAmount(0);
          inputRef.current.value = '';
        });
    }
  }

  function deleteCardLocal() {
    SetIsCardsLoading(true);
    deleteCard(deleteId)
      .then((resp) => {
        if (resp === false) {
          showSnackNotificationPopup({ status: 'FAILED', text: 'Delete card failed' });
          return;
        }

        getCard()
          .then((resp) => {
            if (resp === false) {
              showSnackNotificationPopup({ status: 'FAILED', text: 'Card fetch failed' });
              return;
            }
            setWallet((prevWallet) => ({
              ...prevWallet,
              ...resp,
            }));
          })
          .catch((error) => {
            if (error.message === 'UNAUTHORIZED') {
              logout();
            } else {
              showSnackNotificationPopup({ status: 'FAILED', text: error.message });
            }
          })
          .finally(() => {
            SetIsCardsLoading(false);
            setIsWarningVisible(false);
          });
      })
      .catch((error) => {
        if (error.message === 'UNAUTHORIZED') {
          logout();
        } else {
          showSnackNotificationPopup({ status: 'FAILED', text: error.message });
        }
      });
  }

  useEffect(() => {
    if (orderId === true) {
      SetIsCardsLoading(true);
      getCard()
        .then((resp) => {
          if (resp === false) {
            showSnackNotificationPopup({ status: 'FAILED', text: 'Card fetch failed' });
            return;
          }
          setWallet((prevWallet) => ({
            ...prevWallet,
            ...resp,
          }));
        })
        .catch((error) => {
          if (error.message === 'UNAUTHORIZED') {
            logout();
          } else {
            showSnackNotificationPopup({ status: 'FAILED', text: error.message });
          }
        })
        .finally(() => {
          SetIsCardsLoading(false);
        });
    }
  }, [orderId]);

  return (
    <div className={styles.depositWrapperContainer}>
      {showHeader && (
        <Switch
          names={[t('deposit'), t('withdrawal')]}
          links={['/deposit', '/withdrawal']}
          actives={[true, false]}
        ></Switch>
      )}
      {showHeader && (
        <div className={styles.manageContainer}>
          <div className={styles.header}>{manage ? t('delete.card') : t('payment.method')}</div>
          <span
            onClick={() => {
              setManage(manage ? false : true);
            }}
            className={styles.manage + ' ' + (localWallet.cards && localWallet.cards.length > 0 ? styles.show : '')}
          >
            {manage ? t('cancel') : t('manage') + ' (' + (localWallet.cards ? localWallet.cards.length : 0) + ')'}{' '}
          </span>
        </div>
      )}
      <div className={styles.paymentContainerOuter}>
        {isCardsLoading ? (
          <DotLottieReact data={Loader} loop={true} autoplay={true} />
        ) : (
          <>
            <div className={styles.paymentContainer + ' ' + (manage ? styles.manageActive : '')}>
              {!manage && showHeader && (
                <div
                  onClick={() => selectNewCard()}
                  className={styles.addNewCardOuterDiv + ' ' + (selectedCard === '0' ? styles.selected : '')}
                >
                  <div className={styles.addNewCard}>
                    <div className={styles.cardTopDiv}>
                      <PlusIcon />
                      <input
                        className={styles.checkbox}
                        onChange={() => {}}
                        checked={selectedCard === '0'}
                        type="checkbox"
                      ></input>
                    </div>
                    <p className={styles.addNewText}>{t('pay.with.new.card')}</p>
                    <div className={styles.cardBottomDiv}>
                      <VisaIcon />
                      <MasterCardIcon />
                    </div>
                  </div>
                  <div className={styles.background}></div>
                </div>
              )}
              <Cards
                deleteCard={(id) => {
                  setIsWarningVisible(true);
                  setDeleteId(id);
                }}
                manage={manage}
                selectedCard={selectedCard}
                setSelectedCard={setSelectedCard}
                cards={localWallet.cards}
              />
            </div>
            <div className={styles.cardNavigationContainer + ' ' + (manage ? styles.manageActive : '')}>
              {localWallet.cards &&
                localWallet.cards.map((card, index) => {
                  return (
                    <div key={index} className={styles.cardNavigation}>
                      {card.id === selectedCard ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path
                            d="M0 4C0 3.44772 0.447715 3 1 3H7C7.55228 3 8 3.44772 8 4C8 4.55228 7.55228 5 7 5H1C0.447715 5 0 4.55228 0 4Z"
                            fill="white"
                          />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path
                            d="M0 4C0 3.44772 0.447715 3 1 3H7C7.55228 3 8 3.44772 8 4C8 4.55228 7.55228 5 7 5H1C0.447715 5 0 4.55228 0 4Z"
                            fill="#4D4D4D"
                          />
                        </svg>
                      )}
                    </div>
                  );
                })}
            </div>
          </>
        )}
      </div>
      {!manage && (
        <div className={styles.controls}>
          <div className={styles.amountTitle}>
            <p>{t('enter.amount')}</p>{' '}
            <p>
              {t('min')}. 1.00{localWallet.currencySymbol}
            </p>
          </div>
          <div className={styles.amountContainer}>
            <div className={styles.inputContainer}>
              <input
                name="amount"
                type="number"
                ref={inputRef}
                onFocus={(input) => focusIn(input)}
                onBlur={(input) => focusOut(input)}
                placeholder={`0.00 ${localWallet.currencySymbol}`}
                className={styles.input}
                id="amount"
                autoComplete="off"
              />
            </div>
          </div>
          <div className={styles.amountOptionsContainer}>
            <div
              onClick={(value) => {
                changeInput(value);
              }}
              value="10"
              className={styles.amountOption}
            >
              10 {localWallet.currencySymbol}
            </div>
            <div
              onClick={(value) => {
                changeInput(value);
              }}
              value="20"
              className={styles.amountOption}
            >
              20 {localWallet.currencySymbol}
            </div>
            <div
              onClick={(value) => {
                changeInput(value);
              }}
              value="50"
              className={styles.amountOption}
            >
              50 {localWallet.currencySymbol}
            </div>
            <div
              onClick={(value) => {
                changeInput(value);
              }}
              value="100"
              className={styles.amountOption}
            >
              100 {localWallet.currencySymbol}
            </div>
          </div>
          {selectedCard === '0' && (
            <div className={styles.remember}>
              <p>{t('remember.card')}</p>
              <input className={styles.checkbox} defaultChecked={true} ref={checkboxRef} type="checkbox"></input>
            </div>
          )}
          <div onClick={deposit} className={styles.depositButton + ' ' + (payLoading ? styles.disabled : '')}>
            {payLoading ? (
              <div className={styles.spinLoading}>
                <div className={styles.spinLoadingOuterBlock}>
                  <div className={styles.spinLoadingBlock + ' ' + styles.one}></div>
                </div>
                <div className={styles.spinLoadingOuterBlock}>
                  <div className={styles.spinLoadingBlock + ' ' + styles.two}></div>
                </div>
                <div className={styles.spinLoadingOuterBlock}>
                  <div className={styles.spinLoadingBlock + ' ' + styles.three}></div>
                </div>
              </div>
            ) : (
              t('deposit')
            )}
          </div>
          {/* <div className={styles.depositButton + " " + styles.applePay}>{t('pay.with.apple.pay')}</div> */}
          <div className={styles.infoTextContainer}>
            {/* <div className={styles.infoText}>{t("get.on.balance")} {getNumber.toFixed(2)+localWallet.currencySymbol}</div>
                    <div className={styles.infoText}>{t("get.charged")}  {chargerNumber.toFixed(2)+localWallet.currencySymbol}</div> */}
            <div className={styles.infoDiv}>
              <p className={styles.infoHeader}>{t('minimum')}</p>
              <p className={styles.infoNumber}>1.00 {localWallet && localWallet.currencySymbol}</p>
            </div>
            <div className={styles.infoDiv}>
              <p className={styles.infoHeader}>{t('one.time')}</p>
              <p className={styles.infoNumber}>50,000.00 {localWallet && localWallet.currencySymbol}</p>
            </div>
            <div className={styles.infoDiv}>
              <p className={styles.infoHeader}>{t('daily')}</p>
              <p className={styles.infoNumber}>200,000.00 {localWallet && localWallet.currencySymbol}</p>
            </div>
            <div className={styles.infoDiv}>
              <p className={styles.infoHeader}>{t('other.limits')}</p>
              <p
                onClick={() => {
                  setIsDetailsVisible(true);
                }}
                style={{ textDecoration: 'underline' }}
                className={styles.infoNumber}
              >
                {t('details')}
              </p>
            </div>
          </div>
        </div>
      )}
      {isPopupVisible && (
        <Popup hidePopup={setIsPopupVisible}>
          <BOGPaymentIframe orderId={orderId} setOrderId={setOrderId} setShowModal={setIsPopupVisible} />
        </Popup>
      )}
      {/* {isDepositPopupVisible && (
                <Popup hidePopup={setIsDepositPopupVisible}>
                    <iframe sandbox="allow-forms allow-scripts allow-popups allow-same-origin" className={styles.bogIframe} title='BOGIframe' src={link}></iframe>
                </Popup>
            )} */}
      {isWarningVisible && (
        <WarningPopup
          warningHeader={'card.delete.warning.header'}
          buttonSubmit={'submit.delete'}
          buttonCancel={'cancel'}
          showPopup={isWarningVisible}
          setShowPopup={setIsWarningVisible}
          submit={deleteCardLocal}
        />
      )}
      {isTwoFaVisible && (
        <CardTwoFa depositAmount={depositAmount} setShowPopup={setIsTwoFaVisible} acceptTwoFa={acceptTwoFa} />
      )}
      {isDetailsVisible && (
        <Popup header={'withdraw.deposit.details'} hidePopup={setIsDetailsVisible}>
          <WithdrawDetailsComponent />
        </Popup>
      )}
    </div>
  );
};

export default Deposit;
