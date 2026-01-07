import {useContext } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import NavBar from './NavBar';
import { UserContext } from "../context/UserContext";

function App() {
  const {user, isLoading} = useContext(UserContext)

  const location = useLocation();

  if (isLoading) {
    return null;
  }

 if (!user && location.pathname !== "/login" ) return <Navigate to="/login" />

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
