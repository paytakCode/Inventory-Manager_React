import axios from 'axios';
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';
import {UserInfo} from "../components/userInfo";

interface LoginData {
    email: string;
    password: string;
}

const setUserInfoToCookie = (authorization: string) => {
    const expiresHours = 9;
    const expirationDate = new Date(new Date().getTime() + expiresHours * 60 * 60 * 1000);
    const userInfo: UserInfo = jwt_decode(authorization);
    Cookies.set("jwt", authorization, {expires: expirationDate});
    Cookies.set("userInfo", JSON.stringify(userInfo), {expires: expirationDate});
};

const login = async (loginData: LoginData, navigate: any) => {

    try {
        const response = await axios.post('http://localhost:9999/api/v1/login', loginData);
        if (response.status === 200) {
            console.log(response.headers['authorization']);
            const authorization = response.headers['authorization'];
            setUserInfoToCookie(authorization);
            navigate("/main");
        }
    } catch (error) {
        alert('Login failed');
        navigate("/login");
    }
};

const logout = async (navigate: any) => {

    try {
        const response = await axios.post('http://localhost:9999/api/v1/logout', {}, {
            headers: {
                Authorization: Cookies.get("jwt") as string
            }
        });
        if (response.status === 200) {
            Cookies.remove("jwt");
            Cookies.remove("userInfo");
            alert("로그아웃 되었습니다.");
            navigate("/login");
        }
    } catch (error) {
        alert('Logout failed');
    }
};

export {setUserInfoToCookie, login, logout};
