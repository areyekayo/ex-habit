import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import BehaviorCard from "../behaviors/BehaviorCard";
import { selectTriggerWithBehaviors } from "../../selectors";
import { useMemo } from "react";

function TriggerCard(){
    const {id} = useParams();
    const triggerId = parseInt(id, 10)
    const selectTrigger = useMemo(() => selectTriggerWithBehaviors(triggerId), [triggerId]); 
    const trigger = useSelector(selectTrigger)

    if (!trigger) return <div>Trigger not found</div>

    return (
        <div>
            <h2>{trigger.name}</h2>
            <p>{trigger.description}</p>
            <h3>Related Habits</h3>
            {trigger.behaviors.length > 0 ? (
                trigger.behaviors.map((behavior) => (
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