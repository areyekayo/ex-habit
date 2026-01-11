import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

function BehaviorCard(){
    const {id} = useParams();
    const behaviorId = parseInt(id, 10);

    const behavior = useSelector(state => 
        state.behaviors.list.find(b => b.id === behaviorId)
    );

    if (!behavior) return <div>Behavior not found</div>;
    

    return (
        <>
            <div>
                <h2>{behavior.name}</h2>
                <p>Type: {behavior.type}</p>
                <p>{behavior.description}</p>
            </div>
        </>
    )
}

export default BehaviorCard;