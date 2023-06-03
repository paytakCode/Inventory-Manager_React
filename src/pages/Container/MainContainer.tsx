import React from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/authService";
import User from "pages/Content/UserContent";
import Material from "pages/Content/MaterialContent";
import Product from "pages/Content/ProductContent";
import Production from "pages/Content/ProductionContent";
import SalesOrder from "pages/Content/SalesOrderContent";
import MaterialRequest from "pages/Content/MaterialRequestContent";
import MaterialPurchase from "pages/Content/MaterialPurchaseContent";
import Supplier from "pages/Content/SupplierContent";
import Buyer from "pages/Content/BuyerContent";

interface MainContainerProps {
    content: string;
}

const MainContainer: React.FC<MainContainerProps> = (props) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(navigate);
    };

    const contentMap: { [key: string]: React.FC } = {
        default: () => (
            <>
                <div>메인 컨테이너</div>
                <button onClick={handleLogout}>logout</button>
            </>
        ),
        User: User,
        Material: Material,
        MaterialRequest: MaterialRequest,
        MaterialPurchase: MaterialPurchase,
        Supplier : Supplier,
        Buyer : Buyer,
        Product: Product,
        Production: Production,
        SalesOrder: SalesOrder
    };

    const ContentComponent = contentMap[props.content];

    return (
        <div>
            {ContentComponent && <ContentComponent />}
        </div>
    );
};

export default MainContainer;
