import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../features/users/userSlice";
import { useDispatch, useSelector } from "react-redux";


function NavBar() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {user, isAuthenticated} = useSelector((state) => state.user)

    const handleLogout = () => {
        fetch('/logout',
            {method: 'DELETE', credentials: 'include' })
            .then((r) => {
                if (r.ok) {
                    dispatch(logout());
                    navigate('/login');
                }
            })
        };

    return (
        <nav>
            <NavLink to="/home">Home</NavLink>
            <NavLink to="/behaviors">Behaviors</NavLink>
            {isAuthenticated ? (
                <button onClick={handleLogout}>Logout</button>
            )
                : (<NavLink to="/login">Login</NavLink>)
            }
        </nav>
    )

}

export default NavBar ;