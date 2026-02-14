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
                <h4 key={id}>
                    <Link to={`/behaviors/${id}`}>{name}</Link>
                </h4>
                <p>Type: {type}</p>
                <p>{description}</p>
                <h5>Habit Loop Entries</h5>
                {behaviorWithEntries.entries.length > 0 ? (
                    behaviorWithEntries.entries.map(entry => (
                    <h5 key={entry.id}>
                        <Link to={`/entries/${entry.id}`}>
                            {entry.created_timestamp}
                        </Link>
                    </h5>
                ))
                ) : (
                    <p>No entries</p>
                )}

            </div>
        </>
    )
}

export default NestedBehaviorCard;