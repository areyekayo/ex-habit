import App from "./components/App" ;
import Home from "./pages/Home";
import Login from "./pages/Login";
import BehaviorCollection from "./components/BehaviorCollection";
import BehaviorCard from "./components/BehaviorCard";

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