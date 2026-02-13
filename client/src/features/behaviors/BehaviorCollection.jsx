import {useEffect } from "react";
import { Link } from "react-router-dom";
import {fetchBehaviors} from './behaviorSlice';
import {useSelector, useDispatch} from 'react-redux';
import { selectBehaviorsForUser } from "../../selectors";

function BehaviorCollection() {
    const dispatch = useDispatch();
    const status = useSelector(state => state.behaviors.status);
    const error = useSelector(state => state.behaviors.error);

    const behaviorsForUser = useSelector(selectBehaviorsForUser);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchBehaviors());
        }
    }, [status, dispatch]);

    if (status === 'loading') {
        return <div>Loading behaviors...</div>
    }

    if (status === 'failed') {
        return <div>Error: {error}</div>
    }
    if (behaviorsForUser.length === 0){
        return (
            <div>
                <h2>Your Behaviors</h2>
                <p>You don't have any behaviors yet. Add an entry using a behavior.</p>
            </div>)
    }

    return (
        <>
            <section className="list">
                <h2>Your Behaviors</h2>
                {behaviorsForUser.map(behavior => (
                    <h3 key={behavior.id}>
                        <Link to={`/behaviors/${behavior.id}`} key={behavior.id}>{behavior.name}</Link>
                    </h3>
                ))}
            </section>
        </>
    )
}

export default BehaviorCollection;