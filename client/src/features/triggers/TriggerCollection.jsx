import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectTriggerById } from "./triggerSlice";

function TriggerCollection() {
    const {user, status, error} = useSelector(state => state.user);
    const triggers = useSelector(state => state.triggers.entities)

    if (status === 'loading'){
        return <div>Loading triggers...</div>
    }

    if (status === 'failed'){
        return <div>Error: {error}</div>
    }
    if (!user || !user.triggerIds?.length) return <p>No triggers.</p>

    return (
        <>
            <div>
                <h3>Your Triggers</h3>
                {user.triggerIds.map(triggerId => {
                    const trigger = triggers[triggerId];
                    if (!trigger) return null;
                    return (
                        <h4 key={trigger.id}>
                            <Link to={`/triggers/${trigger.id}`}>{trigger.name}</Link>
                        </h4>
                    )
                })};
            </div>
        </>
    )
}

export default TriggerCollection;