import React from "react";
import Cookies from 'js-cookie';



interface UserInfo{
    id : number;
    email : string;
    name : string;
    tel : string;
    role : string;
}

const Main: React.FC = () => {
    const userInfo:UserInfo = JSON.parse(Cookies.get("userInfo") as string);
    const jwt:string = Cookies.get("jwt") as string;


    return (
        <div>
            <h2>MainPage</h2>
            {userInfo.id}
            {userInfo.name}
            {userInfo.email}
            {userInfo.tel}
            {userInfo.role}
            {jwt}
        </div>
    );
};

export default Main;