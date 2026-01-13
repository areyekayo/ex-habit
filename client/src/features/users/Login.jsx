import { useState, useContext, useEffect } from "react";
import LoginForm from "./LoginForm";
import { UserContext } from "../../context/UserContext";
import {useNavigate, useLocation} from "react-router-dom";

function Login(){
    const [showLogin, setShowLogin] = useState(true);
    const {user} = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (user && location.pathname === "/login") {
            navigate("/home", {replace: true})
        }
    }, [user, navigate, location.pathname])
    
    return (
        <div>
            {showLogin ? (
                <div>
                    <LoginForm />
                    <p>Don't have an account?</p>
                    <button onClick={() => setShowLogin(false)}>
                        Sign Up</button>
                </div>
            ) : (
                <div>
                    {/*add sign up form here */}
                </div>
            )
        }
        </div>
    )
}

export default Login;