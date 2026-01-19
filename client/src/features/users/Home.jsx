import TriggerCollection from "../triggers/TriggerCollection";
import { useSelector } from "react-redux";
import EntryForm from "../journal/EntryForm";

function Home() {
    const {user} = useSelector((state) => state.user)

    return (
        <>
            <h1>Home Page</h1>
            { user ? (<p>Hi, {user.username}</p>)
            : (null)}
            <EntryForm />

            <TriggerCollection />
        </>
    )
}

export default Home;