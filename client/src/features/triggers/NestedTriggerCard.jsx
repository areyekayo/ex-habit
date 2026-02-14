import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectBehaviorWithEntriesByTrigger } from "../../selectors";
import { useMemo, useState } from "react";
import EntryForm from "../journal/EntryForm";
import Modal from "../../components/Modal";

function NestedTriggerCard({trigger, behaviorId}){
    const selectTriggerWithEntries = useMemo(() => selectBehaviorWithEntriesByTrigger(behaviorId, trigger.id), [behaviorId, trigger.id]);

    const triggerWithEntries = useSelector(selectTriggerWithEntries);

    const [entryFormOpen, setEntryFormOpen] = useState(false);
    const closeModal = () => setEntryFormOpen(false);


    if (!trigger) return <div>Trigger not found</div>

    return (
        <>
            <div className="card">
                <h4 key={trigger.id}>
                    <Link to={`/triggers/${trigger.id}`}>{trigger.name}</Link>
                </h4>
                <p>{trigger.description}</p>
                <h5>Habit Loop Entries</h5>
                {triggerWithEntries.entries.length > 0 ? (
                    triggerWithEntries.entries.map(entry => (
                        <h4 key={entry.id}>
                            <Link to={`/entries/${entry.id}`}>
                                {entry.created_timestamp}
                            </Link>
                        </h4>
                    ))
                ) : (
                    <p>No entries</p>
                ) }
                <button onClick={() => setEntryFormOpen(!entryFormOpen)}>Add Entry</button>
            </div>
            {entryFormOpen && (
                <Modal isOpen={true} onClose={closeModal}>
                    <EntryForm initialTriggerId={trigger.id} initialBehaviorId={behaviorId} onSuccess={closeModal}/>
                </Modal>
            )}
        </>
    )
}

export default NestedTriggerCard;