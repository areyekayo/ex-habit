import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectAllTriggers } from "../users/userSlice";

function TriggerCollection() {
    const {user, status, error} = useSelector(state => state.user);
    const triggers = useSelector(selectAllTriggers)

    if (status === 'loading'){
        return <div>Loading triggers...</div>
    }

    if (status === 'failed'){
        return <div>Error: {error}</div>
    }
    if (!user || !user.triggerIds?.length) return (
        <div>
            <h2>Your Triggers</h2>
            <p>You don't have any triggers yet. Add one above.</p>
        </div>
    )

    return (
        <>
            <section className="collection">
                <h2>Your Triggers</h2>
                {user.triggerIds.map(triggerId => {
                    const trigger = triggers.find(t => t.id === triggerId);
                    if (!trigger) return null;
                    return (
                        <h3 key={trigger.id}>
                            <Link to={`/triggers/${trigger.id}`}>{trigger.name}</Link>
                        </h3>
                    )
                })}
            </section>
        </>
    )
}

export default TriggerCollection;