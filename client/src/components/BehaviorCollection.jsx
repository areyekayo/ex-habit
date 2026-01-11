import { useContext } from "react";
import { BehaviorContext } from "../context/BehaviorContext";
import { Link } from "react-router-dom";

function BehaviorCollection() {
    const {behaviors} = useContext(BehaviorContext);

    return (
        <>
            <div>
                <h3>Behaviors</h3>
                {behaviors.map(behavior => (
                    <h4 key={behavior.id}>
                        <Link to={`/behaviors/${behavior.id}`} key={behavior.id}>{behavior.name}</Link>
                    </h4>
                ))}
            </div>
        </>
    )
}

export default BehaviorCollection;