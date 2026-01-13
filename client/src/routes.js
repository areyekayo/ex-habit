import App from "./App" ;
import Home from "./pages/Home";
import Login from "./features/users/Login";
import BehaviorCollection from "./features/behaviors/BehaviorCollection";
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
                path: "/behaviors",
                element: <BehaviorCollection />
            },
            {
                path: "/behaviors/:id",
                element: <BehaviorCard />
            }
        ]
    }
]

export default routes;