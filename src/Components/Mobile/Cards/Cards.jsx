import { useEffect } from 'react';
import styles from './Cards.module.css'
import { BOGIcon, DeleteCardIcon, MasterCardIcon, VisaIcon } from '../../../assets/svg/svg';
import PropTypes from 'prop-types';

const Cards = ({manage, cards, deleteCard , selectedCard, setSelectedCard}) => { 

    useEffect(() => {
        if (cards && cards.length > 0) {
            const selectedcard = cards.filter((card) => card.isDefault)
            setSelectedCard(selectedcard[0].id);
        }else{
            setSelectedCard("0");
        }
    }, [cards])

    function selectCard(id) {
        setSelectedCard(id);
    }

    return (
        <div className={styles.cardsWrapper + " " + (manage ? styles.manageActive : "")}>
            {cards && 
                cards.map((card) => {
                    return (
                        <div key={card.id} className={styles.addNewCardOuterDiv + " " + (manage? styles.manageActive : "") + ((card.id === selectedCard && !manage)? styles.selected: "")}>
                            <div onClick={()=>selectCard(card.id)} className={styles.cardWrapper} key={card.id} id={card.id}>
                                <div className={styles.cardTopDiv}>
                                    <BOGIcon />
                                    {manage ? 
                                        <div className={styles.deleteIcon} onClick={() => {deleteCard(card.id)}}><DeleteCardIcon/></div>
                                    :
                                        <input className={styles.checkbox} onChange={() => {}} checked={card.id === selectedCard} type="checkbox"></input>
                                    }
                                </div>
                                    <h1 className={styles.cardMask}>{card.mask}</h1>
                                    <div className={styles.cardBottomDiv}> {card.cardType === "VISA" ? <VisaIcon /> : <MasterCardIcon />}</div>
                            </div>
                            <div className={styles.background}></div> 
                        </div>
                    )
                })
            }
        </div>
    )
}
export default Cards;

Cards.propTypes = {
    manage: PropTypes.bool.isRequired,
    cards: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            mask: PropTypes.string.isRequired,
            cardType: PropTypes.oneOf(['VISA', 'mc']).isRequired,
            isDefault: PropTypes.bool.isRequired,
        })
    ),
    deleteCard: PropTypes.func.isRequired,
    selectedCard: PropTypes.string.isRequired,
    setSelectedCard: PropTypes.func.isRequired,
};
