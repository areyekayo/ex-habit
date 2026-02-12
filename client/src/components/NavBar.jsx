import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../features/users/userSlice";
import { useDispatch, useSelector } from "react-redux";

function NavBar() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {isAuthenticated} = useSelector((state) => state.user)

    const handleLogout = () => {
        fetch('/logout',
            {method: 'DELETE', credentials: 'include' })
            .then((r) => {
                if (r.ok) {
                    dispatch(logout());
                    navigate('/login', {replace: true, state: null});
                }
            })
        };

    return (
        <nav>
            <NavLink className="nav-link" to="/home">Home</NavLink>
            {isAuthenticated ? (
                <button className="nav-link" onClick={handleLogout}>Logout</button>
            )
                : (<NavLink className="nav-link" to="/login">Login</NavLink>)
            }
        </nav>
    )

}

export default NavBar ;