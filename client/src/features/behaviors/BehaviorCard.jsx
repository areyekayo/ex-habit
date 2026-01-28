import { Link } from "react-router-dom";

function BehaviorCard({behavior}){
    const {id, name, type, description, entries} = behavior;

    if (!behavior) return <div>Behavior not found</div>;

    return (
        <>
            <div>
                <h2>{name}</h2>
                <p>Type: {type}</p>
                <p>{description}</p>
                <h3>Entries</h3>
                {entries.map(entry => (
                    <h4 key={entry.id}>
                        <Link to={`/entries/${entry.id}`}>
                            {entry.created_timestamp}
                        </Link>
                    </h4>
                ))}
            </div>
        </>
    )
}

export default BehaviorCard;