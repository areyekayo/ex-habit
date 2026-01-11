import { useParams } from "react-router-dom";
import {useContext} from "react";
import { BehaviorContext } from "../context/BehaviorContext";

function BehaviorCard(){
    const {behaviors} = useContext(BehaviorContext);

    const {id} = useParams();
    const behaviorId = parseInt(id, 10);

    const behavior = behaviors.find((b) => b.id === behaviorId);

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