import App from "./App" ;
import Home from "./features/users/Home";
import Login from "./features/users/Login";
import TriggerCollection from "./features/triggers/TriggerCollection";
import TriggerCard from "./features/triggers/TriggerCard";
import EntryCard from "./features/journal/Entry";

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
            }
        ]
    }
]

export default routes;