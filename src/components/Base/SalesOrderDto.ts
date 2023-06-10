import OrderStatus from "components/Base/OrderStatus";
import {ProductDto} from "./ProductDto";
import {UserInfoDto} from "./UserInfoDto";
import {BuyerDto} from "./BuyerDto";

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