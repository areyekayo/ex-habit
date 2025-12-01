import { useState, useContext, useEffect } from "react";
import LoginForm from "../components/LoginForm";

function Login(){
    const [showLogin, setShowLogin] = useState(true);
    
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