import { UserContext } from "../context/UserContext";
import { useContext } from "react";
import TriggerCollection from "../features/triggers/TriggerCollection";
function Home() {
    const {user} = useContext(UserContext)

    return (
        <>
            <h1>Home Page</h1>
            { user ? (<p>Hi, {user.username}</p>)
            : (null)}

            <TriggerCollection />
        </>
    )
}

export default Home;