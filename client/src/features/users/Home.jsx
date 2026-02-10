import TriggerCollection from "../triggers/TriggerCollection";
import { useSelector } from "react-redux";
import EntryForm from "../journal/EntryForm";
import { useState } from "react";
import TriggerForm from "../triggers/TriggerForm";
import BehaviorCollection from "../behaviors/BehaviorCollection";
import BehaviorForm from "../behaviors/BehaviorForm";

function Home() {
    const user = useSelector((state) => state.user.user)
    const [showEntryForm, setShowEntryForm] = useState(false);
    const [showTriggerForm, setShowTriggerForm] = useState(false);
    const [showBehaviorForm, setShowBehaviorForm] = useState(false);


    if (!user) return <div>Loading user...</div>

    return (
        <>
            { user ? (<h1>Hi, {user.username}</h1>)
            : (null)}
            <div className="button-container">
                <button onClick={() => setShowEntryForm(!showEntryForm)}>Add Entry</button>

                <button onClick={() => setShowTriggerForm(!showTriggerForm)}>Add Trigger</button>

                <button onClick={() => setShowBehaviorForm(!showBehaviorForm)}>Add Behavior</button>

            </div>
            {showEntryForm ? (
                <EntryForm />
                ) : (<></>)}

            {showTriggerForm ? (
                <TriggerForm />
                ) : (<></>)}

            {showBehaviorForm ? (
                <BehaviorForm />
                ) : (<></>)}
        
            <h3>Your Triggers</h3>
            <TriggerCollection />

            <h3>Your Behaviors</h3>
            <BehaviorCollection />
        </>
    )
}

export default Home;