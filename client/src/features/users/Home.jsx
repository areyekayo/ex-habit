import TriggerCollection from "../triggers/TriggerCollection";
import { useSelector } from "react-redux";
import EntryForm from "../journal/EntryForm";
import { useState } from "react";
import TriggerForm from "../triggers/TriggerForm";
import BehaviorCollection from "../behaviors/BehaviorCollection";
import Modal from "../../components/Modal";
import { selectUser } from "./userSlice";

function Home() {
    const user = useSelector(selectUser)
    const [showTriggerModal, setShowTriggerModal] = useState(false);

    const openTriggerModal = () => setShowTriggerModal(true);
    const closeTriggerModal = () => setShowTriggerModal(false);

    const [showEntryForm, setShowEntryForm] = useState(false);

    if (!user) return <div>Loading user...</div>

    return (
        <>
            { user ? (<h1>Hi, {user.username}</h1>)
            : (null)}
            <div className="button-container">
                {showEntryForm ? (
                    <button onClick={() => setShowEntryForm(!showEntryForm)}>Hide Entry Form</button>
                ) : (
                    <>
                        <button onClick={() => setShowEntryForm(!showEntryForm)}>Add Entry</button>
                        <button onClick={openTriggerModal}>Add Trigger</button>
                    </>
                )}

            </div>
            <Modal isOpen={showTriggerModal} onClose={closeTriggerModal}>
                <TriggerForm onSuccess={closeTriggerModal} />
            </Modal>
        
            {showEntryForm ? (
                <EntryForm />
                ) : (null)}

            <BehaviorCollection />
        
            <TriggerCollection />
        </>
    )
}

export default Home;