import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectBehaviorWithEntriesByTrigger } from "../../selectors";
import { useMemo } from "react";

function NestedBehaviorCard({behavior, triggerId}){
    const {id, name, type, description} = behavior;
    const selectBehaviorWithEntries = useMemo(() => selectBehaviorWithEntriesByTrigger(id, triggerId), [id, triggerId])

    const behaviorWithEntries = useSelector(selectBehaviorWithEntries)

    if (!behavior) return <div>Behavior not found</div>;

    return (
        <>
            <div className="card">
                <h3>{name}</h3>
                <p>Type: {type}</p>
                <p>{description}</p>
                <h3>Entries</h3>
                {behaviorWithEntries.entries.length > 0 ? (
                    behaviorWithEntries.entries.map(entry => (
                    <h4 key={entry.id}>
                        <Link to={`/entries/${entry.id}`}>
                            {entry.created_timestamp}
                        </Link>
                    </h4>
                ))
                ) : (
                    <p>No entries</p>
                )}
            </div>
        </>
    )
}

export default NestedBehaviorCard;