import styles from "./OtpInputs.module.css"
import PropTypes from "prop-types";

const OtpInputs = ({submitFuncion, isError, setIsError, showLoading, formik, setFieldValue}) => {

    function inputChange(event) {
        const { name, value } = event.target;
        if (value.length === 4) {
            const digits = value.split("").slice(0, 4);
            let code4 = "";
            digits.forEach((digit, index) => {
                if(/^\d$/.test(digit)){
                    const fieldName = `number${index + 1}`;
                    code4 += digit;
                    setFieldValue(fieldName, digit);
                }
            });
            const lastInput = document.getElementsByName(`number${digits.length}`)[0];
            if (lastInput) lastInput.focus();
            submitFuncion(code4);
            return;
        }
        
        if (/^\d$/.test(value)) {
            setFieldValue(name, value);
            setIsError(false);

            const parent = event.target.parentElement;
            if (parent.nextElementSibling) {
                parent.nextElementSibling.children[0].focus();
            } else {

                const code =
                    formik.values.number1 +
                    formik.values.number2 +
                    formik.values.number3 +
                    value;
                submitFuncion(code);
            }
        }
    }

    return(
        <div className={styles.inputs}>
                        {[1, 2, 3, 4].map((num) => (
                            <div key={num} className={styles.codeInputContainer}>
                                <input
                                    autoComplete={"one-time-code"} // Browser hint for OTP autofill
                                    className={
                                        styles.inputElement +
                                        (isError ? " " + styles.inputError : "") +
                                        (showLoading ? " " + styles.loading : "")
                                    }
                                    name={`number${num}`}
                                    value={formik.values[`number${num}`] || ""}
                                    onChange={inputChange} // Handles value changes
                                    onKeyDown={(event) => {
                                        if (event.keyCode === 8) {
                                            setFieldValue(event.target.name, "")
                                            if(event.target.value === ""){
                                                if (event.target.parentElement.previousElementSibling) {
                                                    event.target.parentElement.previousElementSibling.children[0].focus()
                                                }
                                            }
                                        }
                                    }}
                                    type="text"
                                    inputMode="numeric" // For mobile-friendly numeric keyboard
                                />
                                <div
                                    className={
                                        styles.background +
                                        (isError ? " " + styles.inputError : "")
                                    }
                                ></div>
                            </div>
                        ))}
                    </div>
    )
}

export default OtpInputs;


OtpInputs.propTypes = {
    submitFuncion: PropTypes.func.isRequired, // Function to handle OTP submission
    isError: PropTypes.bool.isRequired, // Indicates whether there's an error state
    setIsError: PropTypes.func.isRequired, // Function to toggle the error state
    showLoading: PropTypes.bool.isRequired, // Indicates whether loading is shown
    formik: PropTypes.shape({
        values: PropTypes.objectOf(PropTypes.string).isRequired, // Formik's values object with string fields
    }).isRequired, // Formik instance
    setFieldValue: PropTypes.func.isRequired, // Function to set a specific field's value in Formik
};