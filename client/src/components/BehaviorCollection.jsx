import { useContext } from "react";
import { BehaviorContext } from "../context/BehaviorContext";

function BehaviorCollection() {
    const {behaviors} = useContext(BehaviorContext);

    return (
        <>
            <div>
                <h3>Behaviors</h3>
                {behaviors.map(behavior => (
                    <h4 key={behavior.id}>
                        {behavior.name}
                    </h4>
                ))}
            </div>
        </>
    )
}

export default BehaviorCollection;