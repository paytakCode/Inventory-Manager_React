import React from "react";
import AccountManagementMenu from "./AccountManagementMenu";
import MaterialMenu from "./MaterialMenu";
import ProductMenu from "./ProductMenu";
import ProductionMenu from "./ProductionMenu";
import SalesMenu from "./SalesMenu";
import {useNavigate} from "react-router-dom";

const LoadMenuByRole = (props: { role: string }) => {
    const navigator = useNavigate();

    if (props.role === "관리자") {
        return <ul>
            <li><AccountManagementMenu/></li>
            <li><MaterialMenu/></li>
            <li><ProductMenu/></li>
            <li><ProductionMenu/></li>
            <li><SalesMenu/></li>
        </ul>
    } else if (props.role === "자재부" || props.role === "생산부" || props.role === "영업부") {
        return <ul>
            <li><MaterialMenu/></li>
            <li><ProductMenu/></li>
            <li><ProductionMenu/></li>
            <li><SalesMenu/></li>
        </ul>
    } else if (props.role === "대기") {
        alert("부서가 배정되지 않았습니다. 관리자에게 문의하세요.");
        navigator("/login");
        return null;
    } else {
        alert("부적절한 접근입니다.");
        navigator("/");
        return null;
    }
};

export default LoadMenuByRole;