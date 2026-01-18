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
            <h3>Your Habits</h3>
            {trigger && trigger.behaviors.length > 0 ? (
                trigger.behaviors.map((behavior) => (
                    <h4 key={behavior.id}>
                        <Link to={`/behaviors/${behavior.id}`} key={behavior.id}>
                            {behavior.name}
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