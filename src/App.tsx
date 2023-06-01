import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Login from "./pages/LoginPage";
import Intro from "./pages/IntroPage";
import Main from './pages/MainPage';

function App() {

    return (
        <Router>
            <Routes>
                <Route path='/' Component={Intro}/>
                <Route path='/login' Component={Login}/>
                <Route path='/main' Component={Main}/>
            </Routes>
        </Router>
    );
}

export default App;
