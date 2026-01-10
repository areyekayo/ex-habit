import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";


function NavBar() {
    const navigate = useNavigate()

    const {user, onLogout} = useContext(UserContext)

    const handleLogout = () => {
        fetch('/logout',
            {method: 'DELETE'})
            .then((r) => {
                if (r.ok) {
                    onLogout();
                    navigate('/login')
                }
            })
        };

    return (
        <nav>
            <NavLink to="/home">Home</NavLink>
            <NavLink to="/behaviors">Behaviors</NavLink>
            {user ? (
                <button onClick={handleLogout}>Logout</button>
            )
                : (<NavLink to="/login">Login</NavLink>)
            }
        </nav>
    )

}

export default NavBar ;