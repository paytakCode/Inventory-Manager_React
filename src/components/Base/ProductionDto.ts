import ProductionStatus from "./ProductionStatus";
import {ProductDto} from "./ProductDto";
import {UserInfoDto} from "./UserInfoDto";

export interface ProductionDto {
    id: number | null;
    productDto: ProductDto;
    managerDto: UserInfoDto;
    lotNo: string | null;
    details: string | null;
    quantity: number;
    targetDate: Date;
    completionDate: Date | null;
    status: ProductionStatus | null;
}