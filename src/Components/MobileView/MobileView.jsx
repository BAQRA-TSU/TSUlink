import { useEffect, useState } from 'react';
import styles from './MobileVew.module.css'
import { useLocation } from 'react-router-dom';

const MobileView = (props) => {
    const location = useLocation()
    const [wrapper, setShowWrapper] = useState(true);
    

    useEffect(() => {
        if (location.pathname === '/game' ) {
            setShowWrapper(false)
        } else {
            setShowWrapper(true)
        }
    }, [location])
    
    return (
        <>
            {wrapper ?
                <div className={styles.mobileViewWrapper}>
                    <div className={styles.mobileViewContainer}>
                        {props.children}
                    </div>
                </div>
                :
                props.children
            }
        </>
    );
}

export default MobileView;