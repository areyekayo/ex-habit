import {useEffect } from "react";
import { Link } from "react-router-dom";
import {fetchBehaviors} from './behaviorSlice';
import {useSelector, useDispatch} from 'react-redux';
import BehaviorForm from "./BehaviorForm";

function BehaviorCollection() {
    const dispatch = useDispatch();
    const behaviors = useSelector(state => state.behaviors.entities);
    const status = useSelector(state => state.behaviors.status);
    const error = useSelector(state => state.behaviors.error);

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
            <BehaviorForm />
        </>
    )
}

export default BehaviorCollection;