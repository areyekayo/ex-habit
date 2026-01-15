import {useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import NavBar from './components/NavBar';
import { fetchCurrentUser, logout } from "./features/users/userSlice";
import { useDispatch, useSelector } from "react-redux";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {user, isAuthenticated, status} = useSelector((state) => state.user);

  useEffect(()=> {
    dispatch(fetchCurrentUser());
  }, [dispatch])

  useEffect(() => {
    if (status !== "loading" && !isAuthenticated && !user) {
      navigate('/login')
    }
  }, [isAuthenticated, status, navigate])


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
