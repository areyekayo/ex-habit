import {useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import NavBar from './components/NavBar';
import { fetchCurrentUser, logout, selectUser, selectIsAuthenticated } from "./features/users/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { fetchBehaviors } from "./features/behaviors/behaviorSlice";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(selectUser);
  const status = useSelector((state) => state.user.status);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const behaviorStatus = useSelector((state) => state.behaviors.status);

  useEffect(()=> {
    dispatch(fetchCurrentUser());
  }, [dispatch])

  useEffect(() => {
    if (behaviorStatus === 'idle') {
        dispatch(fetchBehaviors());
      }}, [behaviorStatus, dispatch]);

  useEffect(() => {
    const protectedPaths = ['/home', '/behaviors', '/triggers'];
    const isProtectedRoute = protectedPaths.some(path => location.pathname.startsWith(path));

    if ((status === "failed" || status === "idle") && !isAuthenticated && !user && location.pathname !== "/login" && isProtectedRoute) {
      navigate('/login', {replace: true, state: {from: location}})
    }
    if (isAuthenticated && location.pathname === "/login") {
      const from = location.state?.from?.pathname || "/home";
      navigate(from, {replace: true});
    }
  }, [isAuthenticated, status, navigate, location, user])


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
