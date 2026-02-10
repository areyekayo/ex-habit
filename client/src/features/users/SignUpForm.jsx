import { useFormik } from "formik";
import * as yup from "yup";
import { signUpUser } from "./userSlice";
import { useDispatch } from "react-redux";

function SignUpForm() {
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
        onSubmit: async (values, {setErrors}) => {
            const resultAction = await dispatch(signUpUser(values));

            if (signUpUser.rejected.match(resultAction)) {
                if (resultAction.payload.username) {
                    setErrors({username: resultAction.payload.username[0]});
                }
            } else {
                setErrors({username: resultAction.error.message || "Signup failed"})
            }
        }
    })

    return (
        <div className='new-entry-form'>
            <h4>Create An Account</h4>
            <form onSubmit={formik.handleSubmit}>
                <label htmlFor="username">Username</label>
                <input 
                    id="username"
                    name="username"
                    onChange={formik.handleChange}
                    value={formik.values.username}
                />
                {formik.errors.username? (<p style={{color: "red"}}>{formik.errors.username}</p>) : (null)}

                <label htmlFor="password">Password</label>
                <input 
                    id="password"
                    name="password"
                    type="password"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                />
                {formik.errors.password? (<p style={{color: "red"}}>{formik.errors.password}</p>) : (null)}
                <button type="submit">Sign Up</button>
            </form>
        </div>
    )
}

export default SignUpForm;