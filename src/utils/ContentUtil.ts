import AccountManagementContent from "pages/Content/AccountManagementContent";
import MaterialContent from "pages/Content/MaterialContent";
import ProductContent from "pages/Content/ProductContent";
import ProductMaterialContent from "pages/Content/ProductMaterialContent";
import ProductionContent from "pages/Content/ProductionContent";
import SalesOrderContent from "pages/Content/SalesOrderContent";
import MaterialRequestContentContent from "pages/Content/MaterialRequestContent";
import MaterialPurchaseContent from "pages/Content/MaterialPurchaseContent";
import SupplierContent from "pages/Content/SupplierContent";
import BuyerContent from "pages/Content/BuyerContent";
import UserProfileContent from "pages/Content/UserProfileContent";
import LoginContent from "pages/Content/LoginContent";
import DefaultContent from "pages/Content/DefaultContent";
import RegisterContent from "pages/Content/RegisterContent";

const contentMap: { [key: string]: React.FC } = {
    Default: DefaultContent,
    AccountManagement: AccountManagementContent,
    Material: MaterialContent,
    MaterialRequest: MaterialRequestContentContent,
    MaterialPurchase: MaterialPurchaseContent,
    Supplier: SupplierContent,
    Buyer: BuyerContent,
    Product: ProductContent,
    ProductMaterial: ProductMaterialContent,
    Production: ProductionContent,
    SalesOrder: SalesOrderContent,
    UserProfile: UserProfileContent,
    Login: LoginContent,
    Register: RegisterContent,

};

export function renderContentByMenu(menu: string): React.FC | undefined {
    return contentMap[menu];
}
