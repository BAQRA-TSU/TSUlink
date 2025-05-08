import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./GamePage.module.css"
import { openGame } from "../../../Services/common";
import { UserContext } from "../../../Services/userContext";
import { useTranslation } from "react-i18next";
import Draggable from 'react-draggable';
import { CloseCircleIcon, FavoritesIcon, GridIcon, HomeIcon, IframeButton, PlusCircle } from "../../../assets/svg/svg";
import ActivityComponent from "../../../Components/Mobile/Activity/Activity";
import Popup from "../../../Components/Mobile/Popup/Popup";
import GamesContainer from "../../../Components/Mobile/MobileGamesContainer/MobileGamesContainer";
import Deposit from "../WalletPages/Deposit/Deposit";
import NoCards from "../../../Components/Mobile/NoCards/NoCards";
import WarningPopup from "../../../Components/Mobile/WarningPopup/WarningPopup";
import { useNotificationPopup } from "../../../Services/notificationPopupProvider";

const GamePage = () => {
    const [t, i18n] = useTranslation();
    const { userData } = useContext(UserContext);
    const { wallet } = useContext(UserContext);
    const [localWallet, setLocalWallet] = useState();
	const location = useLocation()
    const history = useNavigate()
    const [gameLink, setGameLink] = useState()
    const [isDraggable, setIsDraggable] = useState(true);
    const [dragging, setDragging] = useState(false);
    const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
    const defaultPosition = { x: 0, y: window.innerHeight - 64 - 24 }
    const [position, setPosition] = useState(window.innerHeight - 64 - 24 + 17);
    const [isDepositPopupOpen,setIsDepositPopupOpen] = useState(false);
    const [isFavoritesPopupOpen,setIsFavoritesPopupOpen] = useState(false);
    const [isOtherGamesPopupOpen, setIsOtherGamesPopupOpen] = useState(false);
    const [isIframeLoaded, setIsIframeLoaded] = useState(false);
    const [haveCards, setHaveCards] = useState();
    const [isWarningVisible, setIsWarningVisible] = useState(false);
    const { showSnackNotificationPopup } = useNotificationPopup();
    const { logout } = useContext(UserContext);
    let env = import.meta.env.VITE_APP_ENV

    useEffect(() => {
        if (wallet) {
            setLocalWallet(wallet)
            if (wallet.cards && wallet.cards.length > 0) {
                setHaveCards(true);
            } else {
                setHaveCards(false);
            }
        }
    }, [wallet])
    
    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);

        if (!urlParams) { 
            history('/');
            return;
        }
        if (!isIframeLoaded) {
            openGame(urlParams.get("GameUid"),urlParams.get("OpenMode"), setGameLink, openGame)
                    .then((resp) => {
                        if (!resp) {
                            logout();
                        } else if ( resp !== "pending") {
                            if (urlParams.get("OpenMode") !== "") {
                                history(-1)
                            }
                            setIsIframeLoaded(true);
                        } else if( resp === "blocked"){
                            history('/slots')
                            showSnackNotificationPopup({status: "FAILED" , text: t("user.blocked.in.game")});
                        }
                    }).catch((err) => {
                        console.log(err)
                        history('/');
                    })
        }
    }, [location])


    useEffect(() => {
        setIsDepositPopupOpen(false);
        setIsFavoritesPopupOpen(false);
        setIsOtherGamesPopupOpen(false);
        setIsDraggable(true);
    },[gameLink])
    
    // GAME RECIVE MESSAGE
    // Implement custom logic here to be executed when the user presses
    // the exit button of the GamePlatform
    function onExitGame() {
       history('/slots')
    }

    // For mini games there is additional button for reloading the game 
    // when no connection occurs. You can implement what happens
    // when the user presses the reload button here
    function onReloadGamePlatformEGT() {
        window.location.reload();
    }

    function receiveMessage(event) {
        if (event.data) {
            if (event.data.command === 'exit') {
                onExitGame()
            }
            if (event.data.command === "openGame") {
                // console.log(event.data);
            }
            if (event.data.sender === 'game') {
                if (event.data.name === 'errorMessage') {
                    // window.location.reload();
                    console.log(event.data.data.errorMessage);
                }
            }
            if (event.data.command === 'com.egt-bg.exit') {
                onExitGame();
            }
            else if (event.data.command === 'com.egt-bg.reload') {
                onReloadGamePlatformEGT();  
            } 
        }
    }
    
    useEffect(() => { 
        window.addEventListener("message", receiveMessage, false);
        // getCard(setCards, wallet).then((resp) => {
        //     if (resp === false) {
        //        history('/login') 
        //     }
        // })
    }, [])
    
    // GAME RECIVE MESSAGE
    
    const handleStart = (e, data) => {
        e.preventDefault()
        setStartPosition({ x: data.x, y: data.y });
        setDragging(false);
      };
    
    const handleDrag = (e,data) => {
        setDragging(true);
        if (isDraggable) {
            setPosition(data.y + 17);
          }
    };

    const handleStop = (e, data) => {
        const { x, y } = data;

        // Check if the element was dragged by comparing positions
        const isMoved = startPosition.x !== x || startPosition.y !== y;

        if (!isMoved && !dragging) {
            // If it was not moved and not dragging, treat it as a click
            
            setIsDraggable(prevState => !prevState);
        }
    };
    

    return (
        <div className={styles.gameContainer}>
            
            <Draggable onStart={handleStart} onDrag={handleDrag} onStop={handleStop} defaultClassName={styles.draggableDiv} defaultPosition={defaultPosition} axis="y" bounds="parent">
                <div className={styles.draggableIcon + " " + (!isDraggable? styles.disableDrag : "")}>
                    {!isDraggable ? <CloseCircleIcon size={40}/> : <IframeButton />}
                </div>
            </Draggable>

            {!isDraggable && <div style={{ transform: `translate(0px, ${position}px)` }} onClick={() => { setIsDraggable(true) }} className={styles.draggableOuterDiv}></div>}
            {!isDraggable && <span className={styles.cover} onClick={() => setIsDraggable(true)}></span>}
            {!isDraggable && 
                <div style={{ transform: `translate(0px, ${position + ( position < 200 ? 45 : -200 ) }px)`, flexDirection: `${position < 200 ? "column-reverse" : "column"}` }} className={styles.contentDiv}>
                    <div onClick={() => setIsDepositPopupOpen(true)} className={styles.button + " " + styles.deposit}>
                        <PlusCircle />
                        <p>{t("deposit")}</p>
                    </div>
                    <div onClick={() => setIsOtherGamesPopupOpen(true)} className={styles.button}>
                        <GridIcon />
                        <p>{t("other.games")}</p>
                    </div>
                    <div onClick={() => setIsFavoritesPopupOpen(true)} className={styles.button}>
                        <FavoritesIcon size={16}/>
                        <p>{t("favorites")}</p>
                    </div>
                    <div onClick={() => history('/slots')} className={styles.button}>
                        <HomeIcon />
                        <p>{t("home")}</p>
                    </div>
                </div>
            }

            {isFavoritesPopupOpen && 
                <Popup header={"my.games"} hidePopup={setIsFavoritesPopupOpen}>
                    <ActivityComponent />
                </Popup>
            }
            {isOtherGamesPopupOpen && 
                <Popup header={"games"} hidePopup={setIsOtherGamesPopupOpen}>
                    <GamesContainer />
                </Popup>
            }
            {isWarningVisible && (
                <WarningPopup warningHeader={"back.warning.header"} buttonSubmit={"submit.back"} buttonCancel={"cancel"} showPopup={isWarningVisible} setShowPopup={setIsWarningVisible} submit={() => { history('/deposit')}} />
            )}
            {isDepositPopupOpen && 
                (haveCards
                    ? 
                        <Popup header={"deposit"} hidePopup={setIsDepositPopupOpen}>
                            <Deposit />
                        </Popup>
                    :
                        <Popup header={"deposit"} hidePopup={setIsDepositPopupOpen}>
                            <NoCards setIsDraggable={setIsDraggable} setIsDepositPopupOpen={setIsDepositPopupOpen} setIsWarningVisible={setIsWarningVisible} />
                        </Popup>
                )
            }
            {gameLink && env === "development" && !gameLink.includes('theavigroup') ?
                <iframe src="https://dinosaurgame.app/" width="100%" height="100%" loading="lazy"></iframe>
            :
                <iframe src={gameLink} className={styles.iframe} allow="clipboard-read; autoplay; clipboard-write;" title="GameIframe" allowFullScreen={false}></iframe>
            }

        </div>
    )
}

export default GamePage;
