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
    const [modalContent, setModalContent] = useState(null)

    const openTriggerForm = () => setModalContent("trigger");
    const closeModal = () => setModalContent(null);

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
                        <button onClick={openTriggerForm}>Add Trigger</button>
                    </>
                )}

            </div>
            {modalContent && (
                <Modal isOpen={true} onClose={closeModal}>
                    {modalContent === "trigger" && <TriggerForm onSuccess={closeModal} />}

                </Modal>
            )}

            {showEntryForm ? (
                <EntryForm />
                ) : (null)}

            <BehaviorCollection />
        
            <TriggerCollection />
        </>
    )
}

export default Home;