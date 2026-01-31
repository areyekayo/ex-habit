import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import BehaviorCard from "../behaviors/BehaviorCard";

function TriggerCard(){
    const {id} = useParams();
    const triggerId = parseInt(id, 10)
    const user = useSelector(state => state.user.user)

    const trigger = useSelector(state => {
        if (!user || !user.triggerIds) return null
        return state.user.triggers.entities[triggerId]
    })
    const behaviors = useSelector(state => {
        if (!user || !user.behaviorIds) return null
        return trigger.behaviorIds.map(behaviorId => {
            return state.behaviors.entities[behaviorId]
        })
    })

    if (!trigger) return <div>Trigger not found</div>

    return (
        <div>
            <h2>{trigger.name}</h2>
            <p>{trigger.description}</p>
            <h3>Related Habits</h3>
            {trigger && behaviors.length > 0 ? (
                behaviors.map((behavior) => (
                    <BehaviorCard key={behavior.id} behavior={behavior}/>
                ))
            ) : (
                <p>No entries</p>
            )
        }

        </div>
    )
}

export default TriggerCard