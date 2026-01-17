import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

function TriggerCard(){
    const {id} = useParams();
    const triggerId = parseInt(id, 10)

    const trigger = useSelector(state => {
        const user = state.user.user;
        if (!user || !user.triggers) return null
        return user.triggers.find(t => t.id === triggerId)
    })

    if (!trigger) return <div>Trigger not found</div>

    return (
        <div>
            <h2>{trigger.name}</h2>
            <p>{trigger.description}</p>
            <h3>Entries</h3>
            {trigger && trigger.entries.length > 0 ? (
                trigger.entries.map((entry) => (
                    <h4 key={entry.id}>
                        <Link to={`/entries/${entry.id}`} key={entry.id}>
                            {entry.created_timestamp}
                        </Link>
                    </h4>
                ))
            ) : (
                <p>No entries</p>
            )
        }

        </div>
    )
}

export default TriggerCard