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


    return <UserContext.Provider value={{user, onLogin, onLogout}}>{children}</UserContext.Provider>


}

export {UserContext, UserProvider}