import App from "./components/App" ;
import Home from "./pages/Home";
import Login from "./pages/Login";
import BehaviorCollection from "./components/BehaviorCollection";
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
            }
        ]
    }
]

export default routes;