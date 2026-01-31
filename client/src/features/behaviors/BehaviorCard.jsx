import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function BehaviorCard({behavior}){
    const {id, name, type, description} = behavior;
    const user = useSelector(state => state.user.user);

    const entries = useSelector(state => {
        if (!user || !user.entryIds) return null
        return user.entryIds.map(entryId => {
            return state.entries.entities[entryId]
        })
    })


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