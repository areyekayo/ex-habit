import TriggerCollection from "../features/triggers/TriggerCollection";
import { useSelector } from "react-redux";

function Home() {
    const {user} = useSelector((state) => state.user)

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