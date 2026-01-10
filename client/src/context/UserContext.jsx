import React, {useState, useEffect} from "react";

const UserContext = React.createContext();


function UserProvider({children}) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const onLogin = (user) => {
        setUser({id: user.id, username: user.username})
        setIsLoading(false);
    }

    const onLogout = () => {
        setUser(null);
    }

    useEffect(() => {
        fetch("/current_user", {credentials: "include"})
        .then(r => {
            if (r.ok) return r.json();
            throw new Error("Not logged in");
        })
        .then(user => {
            setUser(user);
        })
        .catch(() => {
            setUser(null);
        })
        .finally(() => {
            setIsLoading(false);
        })
    },[])


    return <UserContext.Provider value={{user, onLogin, onLogout}}>{children}</UserContext.Provider>


}

export {UserContext, UserProvider}