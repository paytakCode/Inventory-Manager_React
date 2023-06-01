import React from "react";
import {useNavigate} from "react-router-dom";
import type {UserInfo} from "components/userInfo";

const LoginUserInfo = (props: { userInfo: UserInfo }) => {
    const navigator = useNavigate();

    return <>
        <span>{props.userInfo.name}</span>
        <span>{props.userInfo.role}</span>
    </>
};

export default LoginUserInfo;