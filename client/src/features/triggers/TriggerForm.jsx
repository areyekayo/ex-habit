import {useState, useEffect} from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import {useDispatch } from "react-redux";
import { createTrigger } from "../users/userSlice";

function TriggerForm({onSuccess}){
    const dispatch = useDispatch()
    const [successMessage, setSuccessMessage] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    
    const formSchema = yup.object().shape({
        name: yup.string().required("Enter a name").min(5, "Name must be at least 5 characters").max(100, "Name must be less than 100 characters"),
        description: yup.string()
    })

    const formik = useFormik({
        initialValues: {
            name: "",
            description: ""
        },
        validationSchema: formSchema,
        validateOnChange: true,
        onSubmit: async (values, {resetForm}) => {
            try {
                dispatch(createTrigger(values));
                setSuccessMessage("Trigger added successfully");
                resetForm();
                setIsSubmitted(true);
            }
            catch (error) {console.error("Trigger submission failed", error)}
        }
    });

    useEffect(() => { // close the form modal after successful submit
        if (isSubmitted){
            const timer = setTimeout(() => {
                if (onSuccess) onSuccess();
                setSuccessMessage("");
                setIsSubmitted(false);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [isSubmitted, onSuccess])

    return (
        <div className="new-entry-form">
            <form onSubmit={formik.handleSubmit}>
                <h3>Add a Trigger</h3>
                <p>Triggers are the cues that prompt a certain behavior or habit. Triggers can be situational, emotional, or mental. Some examples are anxiety, work, social events, stress, etc.</p>
                
                <p>Any trigger you add is private to you, so other users can't see your triggers.</p>
                <div className="form-section">
                    <h4>Trigger Name</h4>
                    <input 
                        type="text"
                        name="name"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.name} />

                    {formik.errors.name && <p style={{color: "red"}}>{formik.errors.name}</p>}
                </div>
                <div className="form-section">
                    <h4>Description</h4>
                    <textarea 
                        placeholder="Describe the trigger"
                        name="description"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.description}

                        />
                </div>

                {successMessage && <p style={{color: "green"}}>{successMessage}</p>}

                <button type="submit" disabled={!formik.isValid || formik.isSubmitting}>Submit</button>
            </form>

        </div>
    )
}

export default TriggerForm;