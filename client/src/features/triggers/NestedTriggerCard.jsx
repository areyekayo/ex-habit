import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectBehaviorWithEntriesByTrigger } from "../../selectors";
import { useMemo } from "react";

function NestedTriggerCard({trigger, behaviorId}){
    const selectTriggerWithEntries = useMemo(() => selectBehaviorWithEntriesByTrigger(behaviorId, trigger.id), [behaviorId, trigger.id])

    const triggerWithEntries = useSelector(selectTriggerWithEntries)
    console.log('trigger with entries in nested trigger card', triggerWithEntries)

    if (!trigger) return <div>Trigger not found</div>

    return (
        <>
            <div>
                <h2>{trigger.name}</h2>
                <p>{trigger.description}</p>
                <h3>Entries</h3>
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