import React from "react";
import {UserInfo} from "../../components/userInfo";
import Cookies from "js-cookie";
import LoadMenuByRole from "../../components/Menu/LoadMenuByRole";


const Header: React.FC = () => {
    const userInfo: UserInfo = JSON.parse(Cookies.get("userInfo") as string);

    return (
        <div>
            <LoadMenuByRole role={userInfo.role}/>
            <h2>Header</h2>
        </div>
    );
};

export default Header;