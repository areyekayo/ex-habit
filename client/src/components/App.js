import React, { useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";
import NavBar from './NavBar';
import LoginForm from "./LoginForm";

function App() {
  return (
    <div>
      <header className="App-header">
        <h1>Ex-Habit</h1>
      </header>
      <LoginForm />
    </div>
  )
}

export default App;
