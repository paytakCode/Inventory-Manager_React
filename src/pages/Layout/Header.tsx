import styles from 'pages/Layout/Header.module.scss'
import {UserInfoDto} from "components/Base/UserInfoDto";
import React from "react";
import Role from "../../components/Base/Role";

const Header = (props: { userInfo: UserInfoDto, onMenuSelect: (menu: string) => void }) => {
    const handleMenuClick = (menu: string) => {
        props.onMenuSelect(menu);
    };

    const loadMenuByRole = (role: string) => {
        if (role === "관리자") {
            return <>
                <div className="d-flex justify-content-center">
                    <div className="dropdown-center">
                        <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            관리자
                        </button>
                        <ul className="dropdown-menu">
                            <li onClick={() => handleMenuClick("User")}>직원 관리</li>
                        </ul>
                    </div>
                    <div className="dropdown-center">
                        <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            자재
                        </button>
                        <ul className="dropdown-menu">
                            <li onClick={() => handleMenuClick("Material")}>자재 목록</li>
                            <li onClick={() => handleMenuClick("MaterialRequest")}>자재 요청</li>
                            <li onClick={() => handleMenuClick("MaterialPurchase")}>자재 구매</li>
                            <li onClick={() => handleMenuClick("Supplier")}>공급처 관리</li>
                        </ul>
                    </div>
                    <div className="dropdown-center">
                        <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown"
                                aria-expanded="false">
                            제품
                        </button>
                        <ul className="dropdown-menu">
                            <li onClick={() => handleMenuClick("Product")}>제품 목록</li>
                            <li onClick={() => handleMenuClick("ProductMaterial")}>제품 BOM</li>
                        </ul>
                    </div>
                    <div className="dropdown-center">
                        <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown"
                                aria-expanded="false">
                            생산
                        </button>
                        <ul className="dropdown-menu">
                            <li onClick={() => handleMenuClick("Production")}>생산 관리</li>
                        </ul>
                    </div>
                    <div className="dropdown-center">
                        <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown"
                                aria-expanded="false">
                            영업
                        </button>
                        <ul className="dropdown-menu">
                            <li onClick={() => handleMenuClick("SalesOrder")}>발주 목록</li>
                            <li onClick={() => handleMenuClick("Buyer")}>구매처 관리</li>
                        </ul>
                    </div>
                </div>
            </>
        } else if (role === "자재부"
            || role === "생산부"
            || role === "영업부") {
            return <>
                <div className="d-flex justify-content-center">
                    <div className="dropdown-center">
                        <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            자재
                        </button>
                        <ul className="dropdown-menu">
                            <li onClick={() => handleMenuClick("Material")}>자재 관리</li>
                            <li onClick={() => handleMenuClick("MaterialRequest")}>자재 요청</li>
                            <li onClick={() => handleMenuClick("MaterialPurchase")}>자재 구매</li>
                            <li onClick={() => handleMenuClick("Supplier")}>공급처 관리</li>
                        </ul>
                    </div>
                    <div className="dropdown-center">
                        <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            제품
                        </button>
                        <ul className="dropdown-menu">
                            <li onClick={() => handleMenuClick("Product")}>제품 관리</li>
                            <li onClick={() => handleMenuClick("MaterialRequest")}>자재 요청</li>
                        </ul>
                    </div>
                    <div className="dropdown-center">
                        <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            생산
                        </button>
                        <ul className="dropdown-menu">
                            <li onClick={() => handleMenuClick("Production")}>생산 관리</li>
                        </ul>
                    </div>
                    <div className="dropdown-center">
                        <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            영업
                        </button>
                        <ul className="dropdown-menu">
                            <li onClick={() => handleMenuClick("SalesOrder")}>발주</li>
                            <li onClick={() => handleMenuClick("Buyer")}>구매처 관리</li>
                        </ul>
                    </div>
                </div>
            </>
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

    const userIcon = (userInfo:UserInfoDto) => {
      return <ul>
        <li>{userInfo.name}</li>
        <li>{userInfo.role}</li>
      </ul>
    };

    return (
        <header className={styles.header}>
            <div className={styles.contents}>
                <div onClick={() => handleMenuClick("default")}>
                    로고 자리
                </div>

                <nav>
                    {loadMenuByRole(props.userInfo.role || Role.Disable)}
                </nav>
                <div>
                    {userIcon(props.userInfo)}
                </div>
            </div>
        </header>
    )
}

export default Header