import React from "react";
import {useNavigate} from "react-router-dom";
import type {UserInfoDto} from "components/Base/UserInfoDto";

const LoginUserInfo = (props: { userInfo: UserInfoDto }) => {
    const navigator = useNavigate();

    return <>
        <span>{props.userInfo.name}</span>
        <span>{props.userInfo.role}</span>
    </>
};

export default LoginUserInfo;