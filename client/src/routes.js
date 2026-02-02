import App from "./App" ;
import Home from "./features/users/Home";
import Login from "./features/users/Login";
import TriggerCollection from "./features/triggers/TriggerCollection";
import TriggerCard from "./features/triggers/TriggerCard";
import EntryCard from "./features/journal/Entry";
import BehaviorCard from "./features/behaviors/BehaviorCard";

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
            },
            {
                path: "/entries/:id",
                element: <EntryCard />
            },
            {
                path: "/behaviors/:id",
                element: <BehaviorCard />
            }
        ]
    }
]

export default routes;