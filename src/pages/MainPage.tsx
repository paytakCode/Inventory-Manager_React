import React, {useEffect, useState} from "react";
import Cookies from 'js-cookie';
import {useNavigate} from "react-router-dom";
import Layout from "pages/Layout/Layout";
import MainContainer from "pages/Container/MainContainer";
import {UserInfoDto} from "../components/Base/UserInfoDto";

const Main: React.FC = () => {
    const navigate = useNavigate();
    const [jwt, setJwt] = useState<string>("");
    const [userInfo, setUserInfo] = useState<UserInfoDto | null>(null);
    const [containerContent, setContainerContent] = useState<string>("default");

    useEffect(() => {
        const isLoggedIn = Cookies.get('jwt') !== undefined;
        if (!isLoggedIn) {
            navigate('/login');
        } else {
            const jwt = Cookies.get('jwt') as string;
            const storedUserInfo = Cookies.get('userInfo');
            if (storedUserInfo) {
                const parsedUserInfo = JSON.parse(storedUserInfo);
                setUserInfo(parsedUserInfo);
            }
        }
    }, []);

    const handleMenuSelect = (selectedMenu: string) => {
        setContainerContent(selectedMenu);
    };

    if (userInfo === null) {
        return <div>Loading...</div>;
    }

    return (
        <Layout userInfo={userInfo} onMenuSelect={handleMenuSelect}>
            <MainContainer content={containerContent}/>
        </Layout>
    );
};

export default Main;