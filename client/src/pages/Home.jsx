import { UserContext } from "../context/UserContext";
import { useContext } from "react";

function Home() {
    const {user} = useContext(UserContext)

    return (
        <>
            <h1>Home Page</h1>
            { user ? (<p>Hi, {user.username}</p>)
            : (null)}
        </>
    )
}

export default Home;