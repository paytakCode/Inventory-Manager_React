import React from "react";
import {useNavigate} from "react-router-dom";
import {logout} from "../../services/authService";
import AccountManagement from "pages/Content/AccountManagementContent";
import Material from "pages/Content/MaterialContent";
import Product from "pages/Content/ProductContent";
import Production from "pages/Content/ProductionContent";
import Sales from "pages/Content/SalesContent";

interface MainContainerProps {
    content: string;
}

const MainContainer: React.FC<MainContainerProps> = (props) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(navigate);
    };

    let content: React.ReactNode = null;

    switch (props.content) {
        case "default":
            content = (
                <>
                    <div>메인 컨테이너</div>
                    <button onClick={handleLogout}>logout</button>
                </>
            );
            break;
        case "AccountManagement":
            content = <AccountManagement/>;
            break;
        case "Material":
            content = <Material/>;
            break;
        case "Product":
            content = <Product/>;
            break;
        case "Production":
            content = <Production/>;
            break;
        case "Sales":
            content = <Sales/>;
            break;
        default:
            content = null;
    }

    return <div>{content}</div>;
};

export default MainContainer;