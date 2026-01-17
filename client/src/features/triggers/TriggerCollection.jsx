import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function TriggerCollection() {
    const {user, status, error} = useSelector(state => state.user);

    if (status === 'loading'){
        return <div>Loading triggers...</div>
    }

    if (status === 'failed'){
        return <div>Error: {error}</div>
    }

    return (
        <>
            <div>
                <h3>Your Triggers</h3>
                {user && user.triggers.length > 0 ? (
                    user.triggers.map((trigger) => (
                        <h4 key={trigger.id}>
                            <Link to={`/triggers/${trigger.id}`} key={trigger.id}>{trigger.name}</Link>
                        </h4>
                    ))
                ) : (<p>No triggers</p>)
                }
            </div>
        </>
    )
}

export default TriggerCollection;