import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import { selectTriggersForBehavior } from "../../selectors";
import { selectBehaviorById } from "./behaviorSlice";
import NestedTriggerCard from "../triggers/NestedTriggerCard";

function BehaviorCard(){
    const {id} = useParams();
    const behaviorId = parseInt(id, 10);
    const behavior = useSelector((state) => selectBehaviorById(state, behaviorId));

    const selectTriggers = useMemo(() => selectTriggersForBehavior(behaviorId), [behaviorId]);

    const triggers = useSelector(selectTriggers);

    if (!behavior) return <p>Behavior not found</p>
    return (
        <div>
            <h2>{behavior.name}</h2>
            <p>{behavior.description}</p>
            <div className="card-collection">
                <h3>Related Triggers</h3>
                {triggers.length === 0 && <p>No triggers associated with this behavior</p>}
                {triggers.map((trigger) => (
                    <NestedTriggerCard key={trigger.id} trigger={trigger} behaviorId={behavior.id}/>
                ))}
            </div>
        </div>
    )
}

export default BehaviorCard;