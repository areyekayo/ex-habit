import {useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import NavBar from './components/NavBar';
import { fetchCurrentUser, logout } from "./features/users/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const {user, isAuthenticated, status} = useSelector((state) => state.user);

  useEffect(()=> {
    dispatch(fetchCurrentUser());
  }, [dispatch])

  useEffect(() => {
    if ((status === "failed" || status === "idle") && !isAuthenticated && !user && location.pathname !== "/login") {
      navigate('/login')
    }
  }, [isAuthenticated, status, navigate, location.pathname])


  return (
    <div>
      <header className="App-header">
        <h1>Ex-Habit</h1>
        <NavBar />
      </header>
      <Outlet />
    </div>
  )
}

export default App;
