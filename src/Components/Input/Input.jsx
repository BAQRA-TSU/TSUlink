import { forwardRef, useEffect, useState } from 'react';
import styles from './Input.module.css'
import PropTypes from 'prop-types';

const Input = forwardRef((props, ref) => {
    const [isTouched, setIsTouched] = useState(false);
    useEffect(() => {
        setIsTouched(props.isError)
    }, [props])
    return (
        <div className={styles.inputContainer}>
            <input
                name={props.name}
                value={props.value}
                maxLength={props.maxlength}
                onChange={props.onChange}
                onBlur={props.onBlur}
                className={styles.input + (props.error && (props.touched || isTouched) ? " " + styles.inputError : "")}
                id={props.id}
                type={props.type}
                ref={ref}
                autoComplete={props.autoComplete}
                onFocus={(e) => e.target.addEventListener("wheel", function (e) { e.preventDefault() }, { passive: false })}
            />
            <div className={styles.background + (props.error && (props.touched || isTouched) ? " " + styles.inputError: "" )}></div>
            <span className={styles.floatingLabel + (props.error && (props.touched || isTouched) ? " " + styles.inputError: "" )}>{props.floatingLabel}</span>
            <p className={styles.error}>
            {props.error && (props.touched || isTouched) && props.error}
            </p>
      </div>
    )
})

export default Input

Input.displayName = "Input";

Input.propTypes = {
    name: PropTypes.string.isRequired,          // The name of the input (required)
    value: PropTypes.string,                    // The value of the input
    maxlength: PropTypes.number,                // Maximum length of the input
    onChange: PropTypes.func.isRequired,        // Function to handle input change (required)
    onBlur: PropTypes.func,                     // Function to handle blur event
    id: PropTypes.string,                       // ID for the input
    type: PropTypes.string.isRequired,          // Input type (e.g., "text", "password") (required)
    autoComplete: PropTypes.string,             // Autocomplete attribute
    floatingLabel: PropTypes.string.isRequired, // Floating label text (required)
    hidePassword: PropTypes.bool,               // Whether to hide the password input
    error: PropTypes.string,                    // Error message for the input
    touched: PropTypes.bool,                    // Whether the input is touched
    isError: PropTypes.bool                     // Indicates if there's an error
};