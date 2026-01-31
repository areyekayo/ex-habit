import { useState, useEffect } from "react";
import LoginForm from "./LoginForm";
import {useNavigate, useLocation} from "react-router-dom";
import { useSelector } from "react-redux";

function Login(){
    const [showLogin, setShowLogin] = useState(true);
    const {user, isAuthenticated} = useSelector((state) => state.user)
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (user && location.pathname === "/login" && isAuthenticated) {
            navigate("/home", {replace: true})
        }
    }, [user, isAuthenticated, navigate, location.pathname])
    
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