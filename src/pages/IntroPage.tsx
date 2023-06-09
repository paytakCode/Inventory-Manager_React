import React from "react";
import {useNavigate} from "react-router-dom";

const IntroPage: React.FC = () => {

    const navigate = useNavigate();
    const navigateToMain = () => {
        navigate("/main")
    }

    return (
        <div>
            <h2>IntroPage</h2>
            <button onClick={navigateToMain}>메인 페이지</button>
        </div>
    );
};

export default IntroPage;