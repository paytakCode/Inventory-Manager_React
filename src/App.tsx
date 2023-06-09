import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import IntroPage from "./pages/IntroPage";
import MainPage from './pages/MainPage';
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {

    return (
        <Router>
            <Routes>
                <Route path='/' Component={IntroPage}/>
                <Route path='/main' Component={MainPage}/>
                <Route path='/login' Component={LoginPage}/>
                <Route path='/register' Component={RegisterPage}/>
            </Routes>
        </Router>
    );
}

export default App;
