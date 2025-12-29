import App from "./components/App" ;
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
        ]
    }
]

export default routes;