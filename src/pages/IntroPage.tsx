import React from "react";
import {useNavigate} from "react-router-dom";

const Intro: React.FC = () => {

    const navigate = useNavigate();
    const navigateToLogin = () => {
        navigate("/login")
    }

    return (
        <div>
            <h2>IntroPage</h2>
            <button onClick={navigateToLogin}>로그인 페이지</button>
        </div>
    );
};

export default Intro;