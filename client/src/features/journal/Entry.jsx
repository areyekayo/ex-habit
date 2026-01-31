import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { updateEntry } from "../users/userSlice";

function EntryCard(){
    const {id} = useParams();
    const entryId = parseInt(id, 10);
    const user = useSelector(state => state.user.user);
    const entry = useSelector(state => state.user.entries.entities[entryId])
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const dispatch = useDispatch();
    
    const formSchema = yup.object().shape({
        description: yup.string().required("Enter a description").min(5, "Description must be at least 5 characters").max(500, "Description must be less than 500 characters"),
        mood: yup.string().required("Select a mood"),
        reward: yup.string(),
        result: yup.string()
    })

    const formik = useFormik({
        initialValues: {
            description: entry ? entry.description : "",
            mood: entry ? entry.mood : "",
            reward: entry? entry.reward  : "",
            result: entry? entry.result : "",
        },
        validationSchema: formSchema,
        validateOnChange: true,
        onSubmit: async(values) => {
            try {
                const updatedEntry = {
                    id: entry.id,
                    trigger_id: entry.trigger_id,
                    behavior_id: entry.behavior_id,
                    description: values.description,
                    mood: values.mood,
                    reward: values.reward,
                    result: values.result
                }
                await dispatch(updateEntry(updatedEntry)).unwrap();
                setSuccessMessage("Entry updated successfully");
                setTimeout(() => setSuccessMessage(""), 4000);
                setTimeout(() => setShowUpdateForm(false), 4000);
                
            }
            catch (error) {console.error("Form submission failed", error)}
        }
    })

    if (!user) return <div>Loading user...</div>
    if (!entry) return <div>Entry not found</div>
    
    return (
        <>
            <h4>{entry.created_timestamp}</h4>
            <p>{entry.description}</p>
            <p>Reward: {entry.reward}</p>
            <p>Result: {entry.result}</p>
            <p>Mood: {entry.mood}</p>

            <button onClick={() => setShowUpdateForm(!showUpdateForm)}>Edit</button>
            {successMessage && <p style={{color: "green"}}>{successMessage}</p>}
            {showUpdateForm ? (
                <div>
                    <form onSubmit={formik.handleSubmit}>
                        <h4>Update Entry</h4>
                        <p>Describe what happened when you engaged in this habit loop</p>
                        <textarea 
                    placeholder="Describe what happened when you engaged in this habit loop"
                    name="description"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.description} 
                />
                 {formik.errors.description && <p style={{color: "red"}}>{formik.errors.description}</p>}

                <h4>Reward</h4>
                <p>What was rewarding about this habit loop?</p>
                <input
                    type="text"
                    name="reward"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.reward}
                />

                <h4>Result</h4>
                <p>What was the result of this habit loop?</p>
                <input 
                    type="text"
                    name="result"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.result}
                    />

                <h4>Mood</h4>
                <p>How do you feel about this habit loop?</p>
                <select
                    name="mood"
                    value={formik.values.mood}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                >
                    <option value="" disabled>Select a mood</option>
                    <option value="Struggling">Struggling</option>
                    <option value="Bad">Bad</option>
                    <option value="Okay">Okay</option>
                    <option value="Good">Good</option>
                    <option value="Great">Great</option>

                    </select>
                {formik.errors.mood && <p style={{color: "red"}}>{formik.errors.mood}</p>}

                <button type="submit" disabled={!formik.isValid || formik.isSubmitting}>Submit Entry</button>

                    </form>
                </div>
            ) : (<></>)}
        </>
    )
    
}

export default EntryCard;