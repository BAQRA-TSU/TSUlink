// import styles from "./Number.module.css";
// import { useEffect } from "react";
// import { useFormik, Form, FormikProvider } from "formik";
// import * as Yup from "yup";

// import { NavLink, useNavigate } from "react-router-dom";
// import { isLogedIn } from "../../../../Services/common";
// import Input from "../../../../Components/Mobile/Input/Input";

// const Number = () => {
//     const history = useNavigate();
  
//     const RegisterSchema = Yup.object().shape({
//         number: Yup.number().required("Number is required"),
//     });

//     useEffect(() => {
//         if (isLogedIn()) {
//             history("/");
//         }
//     }, [history]);

//     function codeChange(input) {
//         if (input.target.value.length >= 3) {
//             input.target.parentElement.nextElementSibling.children[0].focus();
//         }
//     }

//     const formik = useFormik({
//         initialValues: {
//             number: ""
//         },
//         validationSchema: RegisterSchema,
//         onSubmit: () => {
//             history("/register/code");
//         },
//     });

//     const { errors, touched, /*isSubmitting,*/ handleSubmit } = formik;

//     return (
//         <div className={styles.numberWrapper}>
//             <div className={styles.headerContainer}>
//                 <NavLink to={"/register"} className={styles.backIcon}></NavLink>
//                 <NavLink to={"/"} className={styles.aviatorLogo}></NavLink>
//             </div>
//             <h1 className={styles.numberHeader}>დაადასტურეთ ტელეფონის ნომერი</h1>
//             <p className={styles.text}>მითითებულ ნომერზე მიიღებთ დასტურის კოდს, რომლის შეყვანის შემდეგ შექმნით ანგარიშს</p>
//             <FormikProvider value={formik}>
//                 <div className={styles.form}>
//                     <Form onSubmit={handleSubmit}>
//                         <div className={styles.inputs}>
//                             <div className={styles.codeDiv}>
//                                 <input onChange={(input) => codeChange(input)} className={styles.codeInput} type="number"></input>
//                                 <p className={styles.plus}>+</p>
//                             </div>
//                             <Input
//                                 type="number"
//                                 name="number"
//                                 value={formik.values.number}
//                                 onChange={formik.handleChange}
//                                 className={styles.input}
//                                 error={errors.number}
//                                 touched={touched.number}
//                                 floatingLabel={"Phone Number"}
//                             />
//                         </div>
//                         <button className={styles.submitButton} type="submit">
//                             Recive Code
//                         </button>
//                     </Form>
//                 </div>
//             </FormikProvider>
//         </div>
//     );
// };

// export default Number;
