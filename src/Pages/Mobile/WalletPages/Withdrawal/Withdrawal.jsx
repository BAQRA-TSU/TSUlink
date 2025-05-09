import { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styles from './Withdrawal.module.css';
import Switch from '../../../../Components/Mobile/Switch/Switch';
import Cards from '../../../../Components/Mobile/Cards/Cards';
import { deleteCard, getCard, isLogedIn, postWallet } from '../../../../Services/common';
import { UserContext } from '../../../../Services/userContext';
import WarningPopup from '../../../../Components/Mobile/WarningPopup/WarningPopup';
import { MessagePlus } from '../../../../assets/svg/svg';
import Popup from '../../../../Components/Mobile/Popup/Popup';
import WithdrawDetailsComponent from '../../../../Components/Mobile/WithdrawDetailsComponent/WithdrawDetailsComponent';
import { useNotificationPopup } from '../../../../Services/notificationPopupProvider';

const Withdrawal = () => {
  const [t] = useTranslation();
  const [manage, setManage] = useState(false);
  const [getNumber, setGetNumber] = useState(0);
  const [chargerNumber, setChargerNumber] = useState(0);
  const [isWarningVisible, setIsWarningVisible] = useState(false);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [deleteId, setDeleteId] = useState(false);
  const history = useNavigate();
  const inputRef = useRef();
  const [selectedCard, setSelectedCard] = useState('0');
  const procentage = 6;
  const { wallet, setWallet } = useContext(UserContext);
  const [localWallet, setLocalWallet] = useState({ cards: [], currencySymbol: '₾', currceny: 'GEL', balance: 0 });
  const { userData } = useContext(UserContext);
  const [isCardsLoading, setIsCardsLoading] = useState();
  const [isButtonLoading, setIsButtonLoading] = useState();
  const [withdrawAmount, setWithdrawAmount] = useState();
  const [isWithdrawOnlyBlock, setIsWithdrawOnlyBlock] = useState();
  const { showSnackNotificationPopup } = useNotificationPopup();
  const { logout } = useContext(UserContext);

  useEffect(() => {
    if (userData) {
      if (isLogedIn() && !userData.verified) {
        history('/verify');
      }
      if (userData.withdrawalOnlyBlock === true) {
        setIsWithdrawOnlyBlock(true);
      }
    }
  }, [userData]);

  useEffect(() => {
    if (wallet) {
      setLocalWallet(wallet);
    }
  }, [wallet]);

  function focusOut(input) {
    if (localWallet.balance) {
      input.target.type = 'text';
      let oldInputValue = Number(input.target.value);
      let newInput = Math.floor(oldInputValue * 100) / 100;
      newInput = newInput > 10000 ? 10000 : newInput;
      newInput = newInput < 1 && newInput > 0 ? 1 : newInput;
      if (newInput > 0) {
        input.target.value = newInput + ' ' + localWallet.currencySymbol;
        // const willGet = newInput - (newInput * procentage / 100);
        const willGet = Math.ceil((newInput / (100 - procentage)) * 100 * 100) / 100;
        setWithdrawAmount(newInput);
        setGetNumber(willGet);
        setChargerNumber(willGet - newInput);
      } else {
        input.target.value = '';
        setGetNumber(0);
        setChargerNumber(0);
      }
    }
  }

  function focusIn(input) {
    if (localWallet.balance) {
      input.target.type = 'number';
      input.target.readOnly = false;
    } else {
      input.target.readOnly = true;
    }
  }

  function changeInput(input) {
    if (localWallet.balance) {
      inputRef.current.type = 'text';
      let num = Number(input.target.attributes.value.value);
      let newInput = Math.floor(num * 100) / 100;
      num = newInput > 10000 ? 10000 : newInput;
      num = newInput < 1 ? 1 : newInput;
      inputRef.current.value = num.toFixed(2) + ' ' + localWallet.currencySymbol;
      const willGet = Math.ceil((num / (100 - procentage)) * 100 * 100) / 100;
      setWithdrawAmount(num);
      setGetNumber(willGet);
      setChargerNumber(willGet - num);
    }
  }

  function deleteCardLocal() {
    setIsCardsLoading(true);
    deleteCard(deleteId).then(() => {
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
          setIsCardsLoading(false);
          setIsWarningVisible(false);
        });
    });
  }

  // useEffect(() => {
  // setIsCardsLoading(true);
  // getCard(setCards).then((resp) => {
  //     if (resp === false) {
  //         history('/login')
  //     }
  //     setIsCardsLoading(false);
  // })
  // },[])

  function withdraw() {
    if (!(withdrawAmount > 0)) {
      showSnackNotificationPopup({ status: 'FAILED', text: t('withdraw.less.than.min') });
      return false;
    }
    setIsButtonLoading(true);
    postWallet(withdrawAmount, 'WITHDRAW', 'BOG', selectedCard)
      .then((resp) => {
        if (resp === false) {
          showSnackNotificationPopup({ status: 'FAILED', text: 'Post Wallet failed' });
          return;
        }
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
        setIsButtonLoading(false);
        setWithdrawAmount(0);
        inputRef.current.value = '';
      });
  }

  return (
    <>
      <div className={styles.depositWrapperContainer}>
        <Switch
          names={[t('deposit'), t('withdrawal')]}
          links={['/deposit', '/withdrawal']}
          actives={[false, true]}
        ></Switch>
        <div className={styles.manageContainer}>
          <div className={styles.header}>{manage ? t('delete.card') : t('withdraw.method')}</div>
          <span
            onClick={() => {
              setManage(manage ? false : true);
            }}
            className={
              (manage ? styles.cancel : styles.manage) +
              ' ' +
              (localWallet.cards && localWallet.cards.length > 0 ? styles.show : '')
            }
          >
            {' '}
            {manage ? t('cancel') : t('manage') + ' (' + (localWallet.cards ? localWallet.cards.length : 0) + ')'}{' '}
          </span>
        </div>
        <div
          className={styles.paymentContainerOuter}
          style={{ width: localWallet.cards && localWallet.cards.length === 0 ? '100%' : '' }}
        >
          {isCardsLoading ? (
            <>...</>
          ) : localWallet.cards && localWallet.cards.length > 0 ? (
            <>
              <div className={styles.paymentContainer + ' ' + (manage ? styles.manageActive : '')}>
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
          ) : (
            <div
              onClick={() => {
                history('/deposit');
              }}
              className={styles.noCardsDiv + (isWithdrawOnlyBlock ? ' ' + styles.disabled : '')}
            >
              <div className={styles.plusIcon}>
                <MessagePlus />
              </div>
              <div className={styles.noCardsText}>{t('no.cards')}</div>
            </div>
          )}
        </div>
        {!manage && (
          <div
            className={
              styles.controls + ' ' + (localWallet.cards && localWallet.cards.length === 0 ? styles.disabled : '')
            }
          >
            <div className={styles.amountTitle}>
              <p>{t('enter.amount')}</p>
              {getNumber > 0 ? (
                <p className={styles.commision}>
                  {t('will.be.charged')} {getNumber.toFixed(2) + localWallet.currencySymbol} / {t('comm')}{' '}
                  {chargerNumber.toFixed(2) + localWallet.currencySymbol}
                </p>
              ) : (
                <p className={styles.commision}>
                  {t('min')}. 1.00{localWallet.currencySymbol} / {t('commision')} {procentage}%
                </p>
              )}
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
                <div
                  className={styles.maxButton}
                  onClick={(value) => {
                    changeInput(value);
                  }}
                  value={Math.floor((localWallet.balance / 100) * (100 - procentage)) / 100}
                >
                  {t('max')}
                </div>
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
            <div
              className={styles.withdrawalButton + ' ' + (isButtonLoading ? styles.disabled : '')}
              onClick={withdraw}
            >
              {isButtonLoading ? (
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
                t('withdrawal')
              )}
            </div>
            {/* <p className={styles.limitPerCard}>{t("limit.one.card")}</p> */}
            <div className={styles.infoTextContainer}>
              {/* <div className={styles.infoText}>{t("get.on.balance")} {getNumber.toFixed(2)+localWallet.currencySymbol}</div>
                    <div className={styles.infoText}>{t("get.charged")}  {chargerNumber.toFixed(2)+localWallet.currencySymbol}</div> */}
              <div className={styles.infoDiv}>
                <p className={styles.infoHeader}>{t('minimum')}</p>
                <p className={styles.infoNumber}>1.00 {localWallet && localWallet.currencySymbol}</p>
              </div>
              <div className={styles.infoDiv}>
                <p className={styles.infoHeader}>{t('one.time')}</p>
                <p className={styles.infoNumber}>10,000.00 {localWallet && localWallet.currencySymbol}</p>
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
      </div>
      {isDetailsVisible && (
        <Popup header={'withdraw.deposit.details'} hidePopup={setIsDetailsVisible}>
          <WithdrawDetailsComponent />
        </Popup>
      )}
    </>
  );
};

export default Withdrawal;
