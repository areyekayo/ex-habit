import {useState, useEffect} from "react";
import * as yup from "yup";
import {useFormik} from "formik";
import { addEntry } from "./entrySlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchBehaviors } from "../behaviors/behaviorSlice";


function EntryForm(){
    const dispatch = useDispatch();
    const {user} = useSelector((state) => state.user)
    const [successMessage, setSuccessMessage] = useState("");
    const triggers = user?.triggers || [];
    const behaviors = useSelector((state) => state.behaviors.list)
    const behaviorsStatus = useSelector((state) => state.behaviors.status )

    useEffect(() => {
        if (behaviorsStatus === 'idle') {
            dispatch(fetchBehaviors());
        }}, [behaviorsStatus, dispatch]);


    const formSchema = yup.object().shape({
        trigger: yup.string().required("Trigger is required"),
        behavior: yup.string().required("Behavior is required"),
        description: yup.string().required("Enter a description").min(5, "Description must be at least 5 characters").max(500, "Description must be less than 500 characters"),
        mood: yup.string().required("Select a mood"),
        reward: yup.string(),
        result: yup.string()
    });

    const formik = useFormik({
        initialValues: {
            description: "",
            mood: "",
            reward: "",
            result: "",
            trigger: "",
            behavior: ""
        },
        validationSchema: formSchema,
        validateOnChange: true,
        onSubmit: async (values, {resetForm}) => {
            try {
                await dispatch(addEntry(values)).unwrap();
                setSuccessMessage("Entry added successfully");
                resetForm();
            }
            catch (error) {console.error("Form submission failed", error)}
        }
    });

    return (
        <div>
            <form onSubmit={formik.handleSubmit}>
                <h3>Write An Entry</h3>
                {successMessage && <p style={{color: "green"}}>{successMessage}</p>}
                
                <h4>Select A Trigger</h4>
                <p>What was the trigger for this habit loop?</p>
                <select name="trigger" 
                    value={formik.values.trigger}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}>
                        <option value="" disabled>Select a Trigger</option>
                        {triggers.map((trigger) => (
                            <option value={trigger.id} key={trigger.id}>{trigger.name}</option>
                        ))}
                    </select>
                     {formik.errors.trigger && <p style={{color: "red"}}>{formik.errors.trigger}</p>}
                
                <h4>Select a Behavior</h4>
                <p>What was the behavior for this habit loop?</p>
                <select name="behavior"
                    value={formik.values.behavior}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    >
                        <option value="" disabled>Select a Behavior</option>
                        {behaviors.map((behavior) => (
                            <option value={behavior.id} key={behavior.id}>{behavior.name}</option>
                        ))}

                    </select>
                     {formik.errors.behavior && <p style={{color: "red"}}>{formik.errors.behavior}</p>}

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
    )
}

export default EntryForm;