import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMemo, useState } from "react";
import { selectTriggersForBehavior } from "../../selectors";
import { selectBehaviorById } from "./behaviorSlice";
import NestedTriggerCard from "../triggers/NestedTriggerCard";
import EntryForm from "../journal/EntryForm";

function BehaviorCard(){
    const {id} = useParams();
    const behaviorId = parseInt(id, 10);
    const behavior = useSelector((state) => selectBehaviorById(state, behaviorId));

    const selectTriggers = useMemo(() => selectTriggersForBehavior(behaviorId), [behaviorId]);

    const triggers = useSelector(selectTriggers);
    const [showEntryForm, setShowEntryForm] = useState(false);
    const openEntryForm = () => setShowEntryForm(true);
    const closeEntryForm = () => setShowEntryForm(false);

    if (!behavior) return <p>Behavior not found</p>
    return (
        <div>
            <h2>{behavior.name}</h2>
            <p>{behavior.description}</p>
            <div className="button-container">
                {showEntryForm ? (
                    <button onClick={closeEntryForm}>Hide Entry Form</button>
                ) : (
                    <>
                        <button onClick={openEntryForm}>Add Entry</button>
                    </>)}
            </div>
            {showEntryForm ? (
                <EntryForm initialBehaviorId={behaviorId} onSuccess={closeEntryForm} />
                ) : (null)}
            <div className="collection">
                <h3>Your {behavior.name} Related Triggers</h3>
                {triggers.length === 0 && <p>No triggers associated with this behavior</p>}
                {triggers.map((trigger) => (
                    <NestedTriggerCard key={trigger.id} trigger={trigger} behaviorId={behavior.id}/>
                ))}
            </div>

        </div>
    )
}

export default BehaviorCard;