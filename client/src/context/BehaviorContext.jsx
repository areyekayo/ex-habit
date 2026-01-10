import React, {useState, useEffect} from "react";

const BehaviorContext = React.createContext()

function BehaviorProvider({children}){
    const [behaviors, setBehaviors] = useState([]);

    useEffect(() => {
        fetch("/behaviors")
        .then((r) => r.json())
        .then(setBehaviors)
    }, []);

    return (
        <BehaviorContext.Provider value={{behaviors, setBehaviors}}>{children}</BehaviorContext.Provider>
    )
}

export {BehaviorContext, BehaviorProvider};
