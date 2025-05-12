import { NavLink } from "react-router-dom"
import styles from './Switch.module.css'
import PropTypes from "prop-types";


const Switch = ({actives, links, names}) => {
    return (
        <header className={styles.switchContainer}>
            <NavLink className={styles.switchContainerElement + (actives[0] ? " " + styles.active : "")} to={links[0]} >{names[0]}</NavLink>
            <NavLink className={styles.switchContainerElement + (actives[1]? " " + styles.active : "")} to={links[1]} >{names[1]}</NavLink>
        </header>
    )
}

export default Switch

Switch.propTypes = {
    actives: PropTypes.arrayOf(PropTypes.bool).isRequired, // Array indicating active state for each link
    links: PropTypes.arrayOf(PropTypes.string).isRequired, // Array of route paths for the links
    names: PropTypes.arrayOf(PropTypes.string).isRequired, // Array of display names for the links
};