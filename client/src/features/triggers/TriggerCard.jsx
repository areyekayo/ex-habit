import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import NestedBehaviorCard from "../behaviors/NestedBehaviorCard";
import { selectTriggerWithBehaviors } from "../../selectors";
import { useMemo, useState } from "react";
import { updateTrigger, deleteTrigger } from "../users/userSlice";
import { useFormik } from "formik";
import * as yup from "yup";

function TriggerCard(){
    const {id} = useParams();
    const triggerId = parseInt(id, 10)
    const selectTrigger = useMemo(() => selectTriggerWithBehaviors(triggerId), [triggerId]); 
    const trigger = useSelector(selectTrigger)
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const dispatch = useDispatch();
    const [isDeleted, setIsDeleted] = useState(false);
    const navigate = useNavigate()

    const handleDelete = async () => {
        try {
            await dispatch(deleteTrigger(trigger)).unwrap();
            setIsDeleted(true);
            setSuccessMessage("Trigger deleted successfully");
            setTimeout(() => {
                setSuccessMessage("")
                navigate('/home')
            }, 3000);
        } catch (error) {
            console.error('Failed to delete trigger', error);
        }
    }

    const formSchema = yup.object().shape({
        name: yup.string().required("Enter a name").min(5, "Name must be at least 5 characters").max(100, "Name must be less than 100 characters"),
        description: yup.string()
    })

    const formik = useFormik({
        initialValues: {
            name: trigger? trigger.name : "",
            description: trigger ? trigger.description : "",
        },
        validationSchema: formSchema,
        validateOnChange: true,
        onSubmit: async (values) => {
            try {
                const updatedTrigger = {
                    id: trigger.id,
                    user_id: trigger.user_id,
                    name: values.name,
                    description: values.description
                }
                await dispatch(updateTrigger(updatedTrigger)).unwrap();
                setSuccessMessage("Trigger added successfully");
                setTimeout(() => setSuccessMessage(""), 4000);
                setTimeout(() => setShowUpdateForm(false), 4000);
            }
            catch (error) {console.error("Form submission failed", error)}
        }
    });

    if (isDeleted) {
        return <p style={{color: "green"}}>{successMessage}. Redirecting to home...</p>
    }
    if (!trigger) return <div>Trigger not found</div>

    return (
        <div>
            <h2>{trigger.name}</h2>
            <p>{trigger.description}</p>
            <div className="button-container">
                <button onClick={() => setShowUpdateForm(!showUpdateForm)}>Edit</button>

                <button onClick={handleDelete}>Delete</button>
            </div>

            {successMessage && <p style={{color: "green"}}>{successMessage}</p>}
            {showUpdateForm ? (
                <div className="new-entry-form">
                    <form onSubmit={formik.handleSubmit}>
                        <h4>Update Trigger Name</h4>
                        <input
                            type="text"
                            name="name"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.name}/>
                        {formik.errors.name && <p style={{color: "red"}}>{formik.errors.name}</p>}

                        <h4>Description</h4>
                        <textarea 
                            placeholder="Describe the trigger"
                            name="description"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.description}/>

                        <button type="submit" disabled={!formik.isValid || formik.isSubmitting}>Submit</button>
                    </form>
                </div>
            ) : (null)
            }

            <div className="collection">
                <h2>Related Habits</h2>
                {trigger.behaviors.length > 0 ? (
                    trigger.behaviors.map((behavior) => (
                        <NestedBehaviorCard key={behavior.id} behavior={behavior} triggerId={trigger.id}/>
                    ))
                ) : (
                    <p>No habits</p>
                    )
                }
            </div>
        </div>
    )
}

export default TriggerCard