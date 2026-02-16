import {useState} from "react";
import {useFormik} from "formik" ;
import * as yup from "yup";
import { loginUser } from "./userSlice";
import { useDispatch } from "react-redux";

function LoginForm() {
    const [backendErrors, setBackendErrors] = useState({});
    const dispatch = useDispatch();

    const formSchema = yup.object().shape({
            username: yup.string().required("Must enter username"),
            password: yup.string().required("Must enter password")
    })

    const formik = useFormik({
        initialValues: {
            username: "",
            password: ""
        },
        validationSchema: formSchema,
        validateOnChange: true,
        onSubmit: async (values, {setErrors, setFieldValue}) => {

            const resultAction = await dispatch(loginUser(values));

            console.log('result action', resultAction.payload)

            if (loginUser.rejected.match(resultAction)) {
                if (resultAction.payload?.login) {
                    setErrors({login: resultAction.payload.login[0]});
                    setBackendErrors({login: resultAction.payload.login[0]});
                }
                setFieldValue("password", "");
            } else {
                setBackendErrors({});
            }
            }});

    const getError = (field) => {
        if (backendErrors.login) return backendErrors.login;
        if (formik.touched[field] && formik.errors[field]) return formik.errors[field];
        return null
    }

    return (
        <div className="new-entry-form">
            <h4>Log In</h4>
            <form onSubmit={formik.handleSubmit}>
                <div className="form-section">
                    <label htmlFor='username'>Username</label>
                    <input
                        id="username"
                        name="username"
                        onChange={(e) => {
                            setBackendErrors({});
                            formik.handleChange(e);
                        }}
                        onBlur={formik.handleBlur}
                        value={formik.values.username}
                    />
                    {getError("username") && <p style={{color: "red"}}>{getError("username")}</p>}
                </div>
                <div className="form-section">
                    <label htmlFor="password">Password</label>
                    <input 
                        id="password"
                        name="password"
                        type="password"
                        onChange={(e) => {
                            setBackendErrors({});
                            formik.handleChange(e);
                        }}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                        />
                    {getError("password") && <p style={{color: "red"}}>{getError('password')}</p>}
                </div>
                <button type="submit" disabled={!formik.isValid || formik.isSubmitting}>Login</button>
            </form>
        </div>
    )
}

export default LoginForm;