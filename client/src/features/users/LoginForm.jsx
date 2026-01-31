import {useState, useEffect} from "react";
import {useFormik} from "formik" ;
import * as yup from "yup";
import { loginUser } from "./userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

function LoginForm() {
    const [backendErrors, setBackendErrors] = useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const {isAuthenticated} = useSelector((state) => state.user)

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
            console.log('Login result:', resultAction)

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

    
    useEffect(() => {
        if (isAuthenticated){
            const from = location.state?.from?.pathname || "/home";
            navigate(from, {replace: true});
        }
    }, [isAuthenticated, navigate, location]);

    const getError = (field) => {
        if (backendErrors.login) return backendErrors.login;
        if (formik.touched[field] && formik.errors[field]) return formik.errors[field];
        return null
    }

    return (
        <div>
            <h4>Log In</h4>
            <form onSubmit={formik.handleSubmit}>
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
                <button type="submit" disabled={!formik.isValid || formik.isSubmitting}>Login</button>
            </form>
        </div>
    )
}

export default LoginForm;