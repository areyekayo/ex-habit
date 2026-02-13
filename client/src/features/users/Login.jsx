import { useState, useEffect } from "react";
import LoginForm from "./LoginForm";
import {useNavigate, useLocation} from "react-router-dom";
import { useSelector } from "react-redux";
import SignUpForm from "./SignUpForm";

function Login(){
    const [showLogin, setShowLogin] = useState(true);
    const {user, isAuthenticated} = useSelector((state) => state.user)
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => { // redirect authenticated users to home page
        if (user && location.pathname === "/login" && isAuthenticated) {
            navigate("/home", {replace: true})
        }
    }, [user, isAuthenticated, navigate, location.pathname])
    
    return (
        <div>
            {showLogin ? (
                <div className="collection">
                    <LoginForm />
                    <p>Don't have an account?</p>
                    <button onClick={() => setShowLogin(false)}>
                        Sign Up</button>
                </div>
            ) : (
                <div className="collection">
                    <SignUpForm />
                    <p>Already have an account?</p>
                    <button onClick={() => setShowLogin(true)}>
                        Log In
                    </button>
                </div>
            )
        }
        </div>
    )
}

export default Login;