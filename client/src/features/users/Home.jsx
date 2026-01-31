import TriggerCollection from "../triggers/TriggerCollection";
import { useSelector } from "react-redux";
import EntryForm from "../journal/EntryForm";
import { useState } from "react";
import TriggerForm from "../triggers/TriggerForm";

function Home() {
    const user = useSelector((state) => state.user.user)
    const [showEntryForm, setShowEntryForm] = useState(false);
    const [showTriggerForm, setShowTriggerForm] = useState(false);


    if (!user) return <div>Loading user...</div>

    return (
        <>
            <h1>Home Page</h1>
            { user ? (<p>Hi, {user.username}</p>)
            : (null)}

            <button onClick={() => setShowEntryForm(!showEntryForm)}>Add Entry</button>

            {showEntryForm ? (
                <EntryForm />
            ) : (<></>)}

            <button onClick={() => setShowTriggerForm(!showTriggerForm)}>Add A Trigger</button>

            {showTriggerForm ? (
                <TriggerForm />
            ) : (<></>)}
        

            <TriggerCollection />
        </>
    )
}

export default Home;