import {useEffect} from "react";
import {fetchTriggers} from './triggerSlice';
import { useSelector, useDispatch } from "react-redux";

function TriggerCollection() {
    const dispatch = useDispatch();
    const {triggers, status, error} = useSelector(state => state.triggers);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchTriggers());
        }
    }, [status, dispatch]);

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
                {/* {triggers.map(trigger => {
                    <h4 key={trigger.id}>
                        {trigger.name}
                    </h4>
                })} */}
            </div>
        </>
    )
}

export default TriggerCollection;