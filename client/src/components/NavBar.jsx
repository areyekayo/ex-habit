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
            <NavLink>Home</NavLink>
            <NavLink>Collection</NavLink>
            {user ? (
                <button onClick={handleLogout}>Logout</button>
            )
                : (<NavLink to="/login"/>)
            }
        </nav>
    )

}

export default NavBar ;