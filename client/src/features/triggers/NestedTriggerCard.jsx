import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectBehaviorWithEntriesByTrigger } from "../../selectors";
import { useMemo } from "react";

function NestedTriggerCard({trigger, behaviorId}){
    const selectTriggerWithEntries = useMemo(() => selectBehaviorWithEntriesByTrigger(behaviorId, trigger.id), [behaviorId, trigger.id])

    const triggerWithEntries = useSelector(selectTriggerWithEntries)

    if (!trigger) return <div>Trigger not found</div>

    return (
        <>
            <div className="card">
                <h4>{trigger.name}</h4>
                <p>{trigger.description}</p>
                <h4>Entries</h4>
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
            </div>
        </>
    )
}

export default NestedTriggerCard;