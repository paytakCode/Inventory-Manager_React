import React from "react";
import User from "pages/Content/UserContent";
import Material from "pages/Content/MaterialContent";
import Product from "pages/Content/ProductContent";
import ProductMaterial from "pages/Content/ProductMaterialContent";
import Production from "pages/Content/ProductionContent";
import SalesOrder from "pages/Content/SalesOrderContent";
import MaterialRequestContent from "pages/Content/MaterialRequestContent";
import MaterialPurchase from "pages/Content/MaterialPurchaseContent";
import Supplier from "pages/Content/SupplierContent";
import Buyer from "pages/Content/BuyerContent";

interface MainContainerProps {
    content: string;
}

const contentMap: { [key: string]: React.FC } = {
    default: () => (
        <>
            <div>메인 컨테이너</div>
        </>
    ),
    User: User,
    Material: Material,
    MaterialRequest: MaterialRequestContent,
    MaterialPurchase: MaterialPurchase,
    Supplier: Supplier,
    Buyer: Buyer,
    Product: Product,
    ProductMaterial: ProductMaterial,
    Production: Production,
    SalesOrder: SalesOrder,
};

const MainContainer: React.FC<MainContainerProps> = (props) => {
    const ContentComponent = contentMap[props.content];

    return <div>{ContentComponent && <ContentComponent/>}</div>;
};

export default MainContainer;
