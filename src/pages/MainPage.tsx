import React from "react";
import Cookies from 'js-cookie';
import Header from "./Layout/Header";
import Footer from "./Layout/Footer";

interface UserInfo {
    id: number;
    email: string;
    name: string;
    tel: string;
    role: string;
}

const Main: React.FC = () => {
    const userInfo:UserInfo = JSON.parse(Cookies.get("userInfo") as string);
    const jwt:string = Cookies.get("jwt") as string;


    return (
        <>
            <Header/>
            <div>
                <h2>MainPage</h2>
            </div>
            <Footer/>
        </>
    );
};

export default Main;