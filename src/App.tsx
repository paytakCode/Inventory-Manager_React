import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Login from "./components/auth/LoginPage";
import Intro from "./components/auth/IntroPage";
import Main from './components/auth/MainPage';

function App() {
    return (
    <Router>
        <Routes>
            <Route path='/intro' Component={Intro} />
            <Route path='/login' Component={Login} />
            <Route path='/main' Component={Main} />
        </Routes>
    </Router>
  );
}

export default App;
