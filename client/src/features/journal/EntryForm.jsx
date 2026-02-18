import {useState, useEffect} from "react";
import * as yup from "yup";
import {useFormik} from "formik";
import { addEntry, selectAllTriggers } from "../users/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchBehaviors, selectAllBehaviors } from "../behaviors/behaviorSlice";
import Modal from "../../components/Modal";
import TriggerForm from "../triggers/TriggerForm";
import BehaviorForm from "../behaviors/BehaviorForm";

function EntryForm({initialTriggerId = "", initialBehaviorId = "", onSuccess}){
    const dispatch = useDispatch();
    const [successMessage, setSuccessMessage] = useState("");
    const triggers = useSelector(selectAllTriggers);
    const behaviors = useSelector(selectAllBehaviors);
    const [showTriggerModal, setShowTriggerModal] = useState(false);
    const [showBehaviorModal, setShowBehaviorModal] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false)

    const openTriggerModal = () => setShowTriggerModal(true);
    const closeTriggerModal = () => setShowTriggerModal(false);
    const openBehaviorModal = () => setShowBehaviorModal(true);
    const closeBehaviorModal = () => setShowBehaviorModal(false);

    const handleTriggerSuccess = () => {
        closeTriggerModal();
    }

    const handleBehaviorSuccess = () => {
        closeBehaviorModal();
    }

    useEffect(() => { // refresh behaviors in case other users have added new behaviors
        dispatch(fetchBehaviors());
        }, [dispatch]);

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
            trigger: initialTriggerId,
            behavior: initialBehaviorId
        },
        validationSchema: formSchema,
        validateOnChange: true,
        onSubmit: async (values, {resetForm}) => {
            try {
                await dispatch(addEntry(values)).unwrap();
                setSuccessMessage("Entry added successfully");
                resetForm();
                setIsSubmitted(true);
            }
            catch (error) {console.error("Form submission failed", error)}
        }
    });

    useEffect(() => {
        if (initialTriggerId) {
            formik.setFieldValue("trigger", initialTriggerId);
        }
        if (initialBehaviorId) {
            formik.setFieldValue("behavior", initialBehaviorId);
        }
    }, [initialTriggerId, initialBehaviorId, formik])

    useEffect(() => { // close the form on successful submit
        if (isSubmitted) {
            const timer = setTimeout(() => {
                if (onSuccess) onSuccess();
                setSuccessMessage(false);
            }, 3000);
            return () => clearTimeout(timer)
        }
    }, [isSubmitted, onSuccess])

    return (
        <div className="new-entry-form">
            <form onSubmit={formik.handleSubmit}>
                <h3>Write An Entry</h3>
                
                <div className="form-section">
                    <h4>Trigger</h4>
                    <p>What was the trigger or cue for this habit loop?</p>
                    
                    {initialTriggerId ? (<p>Select an existing trigger</p>) :
                    (<p>Select an existing trigger or create a new one.</p>)}
                    <select name="trigger" 
                        value={formik.values.trigger}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}>
                            <option value="" disabled>Select a Trigger</option>
                            {triggers.map((trigger) => (
                                <option value={trigger.id} key={trigger.id}>{trigger.name}</option>
                            ))}
                        </select>
                        {initialTriggerId ? 
                            (null) : (<button type="button" onClick={openTriggerModal}>Add New Trigger</button>)}
                        {formik.errors.trigger && <p style={{color: "red"}}>{formik.errors.trigger}</p>}
                </div>
                
                <div className="form-section">
                    <h4>Behavior</h4>
                    <p>What was the behavior for this habit loop?</p>
                    {initialBehaviorId ? (<p>Select an existing behavior</p>) :
                    (<p>Select an existing behavior or create a new one.</p>)}
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
                        {initialBehaviorId ? 
                            (null) : (<button type="button" onClick={openBehaviorModal}>Add New Behavior</button>)
                            }
                        
                        {formik.errors.behavior && <p style={{color: "red"}}>{formik.errors.behavior}</p>}
                </div>
                <div className="form-section">
                    <h4>Description</h4>
                    <p>Describe what happened. What does this habit feel like in your body?</p>
                    <textarea 
                        placeholder="Describe what happened when you engaged in this habit loop"
                        name="description"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.description} 
                    />
                    {formik.errors.description && <p style={{color: "red"}}>{formik.errors.description}</p>}
                </div>
                <div className="form-section">
                    <h4>Reward</h4>
                    <p>What did you get out of this habit loop?</p>
                    <input
                        type="text"
                        name="reward"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.reward}
                    />
                </div>
                <div className="form-section">
                    <h4>Result</h4>
                    <p>What was the result of this habit loop?</p>
                    <input 
                        type="text"
                        name="result"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.result}
                        />
                </div>
                <div className="form-section">
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
                </div>

                {successMessage && <p style={{color: "green"}}>{successMessage}. Closing the form...</p>}

                <button type="submit" disabled={!formik.isValid || formik.isSubmitting}>Submit Entry</button>

            </form>

            <Modal isOpen={showTriggerModal} onClose={closeTriggerModal}>
                <TriggerForm onSuccess={handleTriggerSuccess}/>
            </Modal>

            <Modal isOpen={showBehaviorModal} onClose={closeBehaviorModal}>
                <BehaviorForm onSuccess={handleBehaviorSuccess} />
            </Modal>
        </div>
    )
}

export default EntryForm;