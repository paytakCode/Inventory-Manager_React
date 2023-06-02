import styles from 'pages/Layout/Header.module.scss'
import {UserInfo} from "components/userInfo";
import React from "react";

const Header = (props: { userInfo: UserInfo, onMenuSelect: (menu: string) => void }) => {
    const handleMenuClick = (menu: string) => {
        props.onMenuSelect(menu);
    };

    const loadMenuByRole = (role: string) => {
        if (role === "관리자") {
            return <ul>
                <li onClick={() => handleMenuClick("AccountManagement")}>계정관리</li>
                <li onClick={() => handleMenuClick("Material")}>자재</li>
                <li onClick={() => handleMenuClick("Product")}>제품</li>
                <li onClick={() => handleMenuClick("Production")}>생산</li>
                <li onClick={() => handleMenuClick("Sales")}>영업</li>
            </ul>
        } else if (role === "자재부"
            || role === "생산부"
            || role === "영업부") {
            return <ul>
                <li onClick={() => handleMenuClick("Material")}>자재</li>
                <li onClick={() => handleMenuClick("Product")}>제품</li>
                <li onClick={() => handleMenuClick("Production")}>생산</li>
                <li onClick={() => handleMenuClick("Sales")}>영업</li>
            </ul>
        } else if (role === "대기") {
            return <ul>
                <li>부서가 배정되지 않았습니다. 관리자에게 문의하세요.</li>
            </ul>
        } else {
            return <ul>
                <li>부적절한 접근입니다.</li>
            </ul>
        }
    };

    const userIcon = (userInfo:UserInfo) => {
      return <ul>
        <li>{userInfo.name}</li>
        <li>{userInfo.role}</li>
      </ul>
    };

    return (
        <header className={styles.header}>
            <div className={styles.contents}>
                <div>
                    로고 자리
                </div>

                <nav className={styles.navigation}>
                    {loadMenuByRole(props.userInfo.role)}
                </nav>
                <div>
                    {userIcon(props.userInfo)}
                </div>
            </div>
        </header>
    )
}

export default Header