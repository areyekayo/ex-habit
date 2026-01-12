import {useState} from "react";
import * as yup from "yup";
import {useFormik} from "formik";
import { addBehavior } from "./behaviorSlice";
import { useDispatch } from "react-redux";

function BehaviorForm() {
    const dispatch = useDispatch();
    const [successMessage, setSuccessMessage] = useState("");

    const formSchema = yup.object().shape({
        name: yup.string().required("Enter a name for the behavior").min(5, "Name must be at least 5 characters").max(100, "Name must be less than 100 characters"),
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
                setSuccessMessage("Behavior added successfully")
                resetForm();
            }
            catch (error) { console.error("Form submission failed: ", error);}
        }
    });

    return (
        <div>
            <form onSubmit={formik.handleSubmit}>
                <h3>Add A Behavior</h3>
                {successMessage && <p style={{color: "green"}}>{successMessage}</p>}

                <h4>Select Behavior Type</h4>
                <select
                    name="type"
                    value={formik.values.type}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                >
                    <option value="" disabled>Select a type</option>
                    <option value="Financial">Financial</option>
                    <option value="Health">Health</option>
                    <option value="Productivity">Productivity</option>

                </select>
                {formik.errors.type && <p style={{color: "red"}}>{formik.errors.type}</p>}
                <h4>Name</h4>
                <input
                    type="text"
                    name="name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.title} />
                {formik.errors.name && <p style={{color: "red"}}>{formik.errors.title}</p>}

                <h4>Description</h4>
                <input
                    type="text"
                    name="description"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.description}
                />
                {formik.errors.description && <p style={{color: "red"}}>{formik.errors.description}</p>}

                <button type="submit" disabled={!formik.isValid || formik.isSubmitting}>Add Behavior</button>
            </form>
        </div>
    )
}

export default BehaviorForm;