import {useState, useEffect} from "react";
import * as yup from "yup";
import {useFormik} from "formik";
import { addBehavior } from "./behaviorSlice";
import { useDispatch } from "react-redux";

function BehaviorForm({onSuccess}) {
    const dispatch = useDispatch();
    const [successMessage, setSuccessMessage] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const formSchema = yup.object().shape({
        name: yup.string().required("Enter a name for the behavior").min(3, "Name must be at least 3 characters").max(100, "Name must be less than 100 characters"),
        description: yup.string().required("Description is required."),
        type: yup.string().required("Type is required.")
    });

    const formik = useFormik({
        initialValues: {
            name: "",
            description: "",
            type: ""
        },
        validationSchema: formSchema,
        validateOnChange: true,
        onSubmit: async (values, {resetForm}) => {
            
            try {
                await dispatch(addBehavior(values)).unwrap();
                setSuccessMessage("Behavior added successfully. Closing the form...")
                resetForm();
                setIsSubmitted(true);
            }
            catch (error) { console.error("Form submission failed: ", error);}
        }
    });

    useEffect(() => { // close the form if opened as modal
        if (isSubmitted) {
            const timer = setTimeout(() => {
                if (onSuccess) onSuccess();
                setSuccessMessage("");
                setIsSubmitted(false);
            }, 3000);
        
        return () => clearTimeout(timer)
        }
    }, [isSubmitted, onSuccess])

    return (
        <div className="new-entry-form">
            <form onSubmit={formik.handleSubmit}>
                <h3>Add A Behavior</h3>
        
                <p>Behaviors are the types of habits that you wish to stop doing. Behaviors can be social, emotional, mental, or physical.</p>
                
                <p>All behaviors will be available to other users, so do not add any personal information!</p>
                <div className="form-section">
                    <h4>Select Behavior Type</h4>
                    <select
                        name="type"
                        value={formik.values.type}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    >
                        <option value="" disabled>Select a type</option>
                        <option value="Finance">Finance</option>
                        <option value="Health">Health</option>
                        <option value="Productivity">Productivity</option>
                        <option value="Social">Social</option>

                    </select>
                {formik.errors.type && <p style={{color: "red"}}>{formik.errors.type}</p>}
                </div>
                <div className="form-section">
                    <h4>Name</h4>
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
                        placeholder="Describe the behavior"
                        name="description"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.description}
                    />
                    {formik.errors.description && <p style={{color: "red"}}>{formik.errors.description}</p>}
                </div>

                {successMessage && <p style={{color: "green"}}>{successMessage}</p>}

                <button type="submit" disabled={!formik.isValid || formik.isSubmitting}>Submit</button>
            </form>
        </div>
    )
}

export default BehaviorForm;