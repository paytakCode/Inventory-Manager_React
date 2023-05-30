import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import {useNavigate} from "react-router-dom";
import jwt_decode from "jwt-decode";

interface LoginProps {
    email: string;
    password: string;
}

interface UserInfo{
    id : number;
    email : string;
    name : string;
    tel : string;
    role : string;
}


const Login: React.FC = () => {
    const [loginData, setLoginData] = useState<LoginProps>({
        email: '',
        password: '',
    });

    const navigate = useNavigate();
    const navigateToIntro = () => {
        navigate("/intro");
    }

    const setUserInfoToCookie = (authorization:string) => {
        const expiresHours = 9;
        const expirationDate = new Date(new Date().getTime() + expiresHours * 60 * 60 * 1000);
        const userInfo:UserInfo = jwt_decode(authorization);
        Cookies.set('jwt', authorization, { expires: expirationDate });
        Cookies.set('userInfo', JSON.stringify(userInfo) , { expires: expirationDate });
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoginData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:9999/api/v1/login', loginData);
            if (response.status === 200){
                console.log(response.headers['authorization']);
                const authorization = response.headers['authorization'];
                setUserInfoToCookie(authorization);
                navigate("/main");
            }

        } catch (error) {
            alert('Login failed');
        }
    };

    return (
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
            <button onClick={handleLogin}>로그인</button>
        </div>
    );
};

export default Login;
