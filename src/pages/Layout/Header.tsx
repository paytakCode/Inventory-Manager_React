import styles from 'pages/Layout/Header.module.scss';
import React, {useEffect} from "react";
import Role from "components/Base/Role";
import Button from 'react-bootstrap/Button';
import {isLogined, logout} from "services/authService";
import {getCurrentUserInfo} from "services/userService";
import {useNavigate} from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

const Header = (props: { onMenuSelect: (menu: string) => void }) => {
    const currentUserInfo = getCurrentUserInfo();
    const navigate = useNavigate();
    const handleMenuClick = (menu: string) => {
        props.onMenuSelect(menu);
    };

    useEffect(() => {
        if (isLogined()) {
            handleMenuClick("Default");
        }
    }, []);

    const loadMenuByRole = (role: string) => {
        if (role === "관리자") {
            return (
                <Nav className="mr-auto">
                    <NavDropdown
                        id="adminDropdown"
                        title="관리자"
                        menuVariant="dark"
                        className={styles.dropdown}
                    >
                        <NavDropdown.Item onClick={() => handleMenuClick("AccountManagement")}>직원 관리</NavDropdown.Item>
                    </NavDropdown>
                    <NavDropdown
                        id="materialDropdown"
                        title="자재"
                        menuVariant="dark"
                        className={styles.dropdown}
                    >
                        <NavDropdown.Item onClick={() => handleMenuClick("Material")}>자재 목록</NavDropdown.Item>
                        <NavDropdown.Item onClick={() => handleMenuClick("MaterialRequest")}>자재 요청</NavDropdown.Item>
                        <NavDropdown.Item onClick={() => handleMenuClick("MaterialPurchase")}>자재 구매</NavDropdown.Item>
                        <NavDropdown.Item onClick={() => handleMenuClick("Supplier")}>공급처 관리</NavDropdown.Item>
                    </NavDropdown>
                    <NavDropdown
                        id="productDropdown"
                        title="제품"
                        menuVariant="dark"
                        className={styles.dropdown}
                    >
                        <NavDropdown.Item onClick={() => handleMenuClick("Product")}>제품 목록</NavDropdown.Item>
                        <NavDropdown.Item onClick={() => handleMenuClick("ProductMaterial")}>제품 BOM</NavDropdown.Item>
                    </NavDropdown>
                    <NavDropdown
                        id="productionDropdown"
                        title="생산"
                        menuVariant="dark"
                        className={styles.dropdown}
                    >
                        <NavDropdown.Item onClick={() => handleMenuClick("Production")}>생산 관리</NavDropdown.Item>
                    </NavDropdown>
                    <NavDropdown
                        id="salesDropdown"
                        title="영업"
                        menuVariant="dark"
                        className={styles.dropdown}
                    >
                        <NavDropdown.Item onClick={() => handleMenuClick("SalesOrder")}>발주 목록</NavDropdown.Item>
                        <NavDropdown.Item onClick={() => handleMenuClick("Buyer")}>구매처 관리</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            );
        } else if (role === "자재부" || role === "생산부" || role === "영업부") {
            return (
                <Nav className="mr-auto">
                    <NavDropdown
                        id="materialDropdown"
                        title="자재"
                        menuVariant="dark"
                        className={styles.dropdown}
                    >
                        <NavDropdown.Item onClick={() => handleMenuClick("Material")}>자재 관리</NavDropdown.Item>
                        <NavDropdown.Item onClick={() => handleMenuClick("MaterialRequest")}>자재 요청</NavDropdown.Item>
                        <NavDropdown.Item onClick={() => handleMenuClick("MaterialPurchase")}>자재 구매</NavDropdown.Item>
                        <NavDropdown.Item onClick={() => handleMenuClick("Supplier")}>공급처 관리</NavDropdown.Item>
                    </NavDropdown>
                    <NavDropdown
                        id="productDropdown"
                        title="제품"
                        menuVariant="dark"
                        className={styles.dropdown}
                    >
                        <NavDropdown.Item onClick={() => handleMenuClick("Product")}>제품 관리</NavDropdown.Item>
                        <NavDropdown.Item onClick={() => handleMenuClick("MaterialRequest")}>자재 요청</NavDropdown.Item>
                    </NavDropdown>
                    <NavDropdown
                        id="productionDropdown"
                        title="생산"
                        menuVariant="dark"
                        className={styles.dropdown}
                    >
                        <NavDropdown.Item onClick={() => handleMenuClick("Production")}>생산 관리</NavDropdown.Item>
                    </NavDropdown>
                    <NavDropdown
                        id="salesDropdown"
                        title="영업"
                        menuVariant="dark"
                        className={styles.dropdown}
                    >
                        <NavDropdown.Item onClick={() => handleMenuClick("SalesOrder")}>발주</NavDropdown.Item>
                        <NavDropdown.Item onClick={() => handleMenuClick("Buyer")}>구매처 관리</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            );
        } else {
            return null;
        }
    };

    const userIcon = () => {
        if (!isLogined()) {
            return (
                <>
                    <Button variant="dark" onClick={() => navigate("/login")}>
                        로그인
                    </Button>
                    <Button variant="dark" onClick={() => navigate("/register")}>
                        직원 등록
                    </Button>
                </>
            );
        } else {
            return (
                <Nav>
                    <NavDropdown
                        id="userDropdown"
                        title={`${currentUserInfo.role} : ${currentUserInfo.name}`}
                        menuVariant="dark"
                        className={styles.dropdown}
                    >
                        <NavDropdown.Item onClick={() => props.onMenuSelect("UserProfile")}>
                            내정보
                        </NavDropdown.Item>
                        <NavDropdown.Item onClick={() => {
                            logout().then(() => props.onMenuSelect("Login"))
                        }}>
                            로그아웃
                        </NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            );
        }
    };

    return (
        <Navbar variant="dark" bg="dark" expand="lg">
            <Container fluid>
                <Navbar.Brand onClick={() => handleMenuClick("Default")}>
                    <h3 className={styles.title}>Inventory Manager</h3>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbar-dark-example"/>
                <Navbar.Collapse id="navbar-dark-example" className={styles.navbar}>
                    <div>
                        {loadMenuByRole(currentUserInfo.role || Role.Disable)}
                    </div>
                    <div>
                        {userIcon()}
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;
