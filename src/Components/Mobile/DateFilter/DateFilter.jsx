import { useTranslation } from 'react-i18next';
import styles from './DateFilter.module.css';
import { useState } from 'react';
import PropTypes from 'prop-types';

const DateFilter = ({filterByDate}) => {
    const { t } = useTranslation()
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

    function dateChange(params) {
        if (params.target.name === "trip-start") {
            if (params.target.value === "") {
                setStartDate(new Date().toISOString().split('T')[0])
            } else {
                setStartDate(params.target.value)
            }
        } else {
            if (params.target.value === "") {
                setEndDate(new Date().toISOString().split('T')[0])
            } else {
                setEndDate(params.target.value)
            }
        }
    }

    return (
        <div className={styles.dateComponent}>
            <div className={styles.header}>
                <p className={styles.headerItem}>{t('from')}</p>
                <p className={styles.headerItem}>{t('to')}</p>
            </div>
            <div className={styles.pickerComponent}>
                <input className={styles.pickerItem} onChange={(e) => dateChange(e)} type="date" id="start" name="trip-start" value={startDate} min="2018-01-01" max={new Date().toISOString().split('T')[0]} />
                <input className={styles.pickerItem} onChange={(e) => dateChange(e)} type="date" id="end" name="trip-end" value={endDate} min={startDate} max={new Date().toISOString().split('T')[0]} />
            </div>
            <div className={styles.submit} onClick={() => filterByDate(startDate,endDate)}>{t("save.changes")}</div>
        </div>
    )
}

export default DateFilter;

DateFilter.propTypes = {
    filterByDate: PropTypes.func.isRequired,
};