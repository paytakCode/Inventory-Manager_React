import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import Footer from "pages/Layout/Footer";
import {login} from "services/authService";
import Cookies from "js-cookie";

interface LoginProps {
    email: string;
    password: string;
}

const Login: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const isLoggedIn = Cookies.get('jwt') !== undefined;
        if (isLoggedIn) {
            navigate('/main');
        }
    });


    const [loginData, setLoginData] = useState<LoginProps>({
        email: '',
        password: '',
    });

    const navigateToIntro = () => {
        navigate("/");
    }


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoginData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <>
            <div>
                <button onClick={navigateToIntro}>인트로 페이지</button>
                <h2>로그인</h2>
                <div>
                    <label htmlFor="email">이메일</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={loginData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">비밀번호</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={loginData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button onClick={() => login(loginData, navigate)}>로그인</button>
            </div>
            <Footer/>
        </>
    );
};

export default Login;
