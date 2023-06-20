import OrderStatus from "components/Base/OrderStatus";
import {ProductDto} from "components/Base/ProductDto";
import {UserInfoDto} from "components/Base/UserInfoDto";
import {BuyerDto} from "components/Base/BuyerDto";

export interface SalesOrderDto {
    id: number | null;
    productDto: ProductDto;
    quantity: number;
    price: number;
    regDate: Date | null;
    managerDto: UserInfoDto;
    buyerDto: BuyerDto;
    dueDate: Date;
    completionDate: Date | null
    status: OrderStatus | null;
}