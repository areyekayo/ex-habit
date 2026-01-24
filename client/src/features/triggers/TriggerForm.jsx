import {useState, useEffect} from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import {useDispatch, useSelector} from "react-redux";
import { addTrigger } from "./triggerSlice";

function TriggerForm(){
    const dispatch = useDispatch()
    const [successMessage, setSuccessMessage] = useState("");
    
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
                await dispatch(addTrigger(values)).unwrap();
                setSuccessMessage("Trigger added successfully");
                resetForm()
            }
            catch (error) {console.error("Trigger submission failed", error)}
        }
    });

    return (
        <div>
            <form onSubmit={formik.handleSubmit}>
                <h3>Add a Trigger</h3>
                {successMessage && <p style={{color: "green"}}>{successMessage}</p>}
                <h4>Trigger Name</h4>
                <input 
                    type="text"
                    name="name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name} />

                {formik.errors.name && <p style={{color: "red"}}>{formik.errors.name}</p>}

                <h4>Description</h4>
                <textarea 
                    placeholder="Describe the trigger"
                    name="description"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.description}

                    />

                <button type="submit" disabled={!formik.isValid || formik.isSubmitting}>Submit</button>
            </form>

        </div>
    )
}

export default TriggerForm;