import App from "./App" ;
import Home from "./features/users/Home";
import Login from "./features/users/Login";
import BehaviorCollection from "./features/behaviors/BehaviorCollection";
import BehaviorCard from "./features/behaviors/BehaviorCard";
import TriggerCollection from "./features/triggers/TriggerCollection";
import TriggerCard from "./features/triggers/TriggerCard";

const routes = [
    {
        path:"/",
        element: <App />,
        children: [
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/home",
                element: <Home />
            },
            {
                path: "/triggers",
                element: <TriggerCollection />,
            },
            {
                path: "/triggers/:id",
                element: <TriggerCard />
            }
        ]
    }
]

export default routes;