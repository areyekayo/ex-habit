import App from "./App" ;
import Home from "./pages/Home";
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
                path: "/behaviors",
                element: <BehaviorCollection />
            },
            {
                path: "/behaviors/:id",
                element: <BehaviorCard />
            },
            {
                path: "/triggers",
                element: <TriggerCollection />
            },
            {
                path: "/triggers/:id",
                element: <TriggerCard />
            }
        ]
    }
]

export default routes;