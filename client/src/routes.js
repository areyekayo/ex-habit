import App from "./components/App" ;
import Home from "./pages/Home";
import Login from "./pages/Login";

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
            }
        ]
    }
]

export default routes;