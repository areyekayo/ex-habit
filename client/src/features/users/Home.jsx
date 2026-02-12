import TriggerCollection from "../triggers/TriggerCollection";
import { useSelector } from "react-redux";
import EntryForm from "../journal/EntryForm";
import { useState } from "react";
import TriggerForm from "../triggers/TriggerForm";
import BehaviorCollection from "../behaviors/BehaviorCollection";
import BehaviorForm from "../behaviors/BehaviorForm";
import Modal from "../../components/Modal";

function Home() {
    const user = useSelector((state) => state.user.user)
    const [modalContent, setModalContent] = useState(null)

    const openTriggerForm = () => setModalContent("trigger");
    const openBehaviorForm = () => setModalContent("behavior");
    const closeModal = () => setModalContent(null);

    const [showEntryForm, setShowEntryForm] = useState(false);

    if (!user) return <div>Loading user...</div>

    return (
        <>
            { user ? (<h1>Hi, {user.username}</h1>)
            : (null)}
            <div className="button-container">
                <button onClick={() => setShowEntryForm(!showEntryForm)}>{showEntryForm ? (<p>Hide Entry</p>) : (<p>Add Entry</p>)}</button>

                <button onClick={openTriggerForm}>Add Trigger</button>

                <button onClick={openBehaviorForm}>Add Behavior</button>
            </div>
            {modalContent && (
                <Modal isOpen={true} onClose={closeModal}>
                    {modalContent === "trigger" && <TriggerForm onSuccess={closeModal} />}
                    {modalContent === "behavior" && <BehaviorForm onSuccess={closeModal} />}
                </Modal>
            )}

            {showEntryForm ? (
                <EntryForm />
                ) : (<></>)}
        
            <h3>Your Triggers</h3>
            <TriggerCollection />

            <h3>Your Behaviors</h3>
            <BehaviorCollection />
        </>
    )
}

export default Home;