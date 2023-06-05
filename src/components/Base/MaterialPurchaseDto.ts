import PurchaseStatus from "components/Base/PurchaseStatus";
import {MaterialDto} from "./MaterialDto";
import {UserInfoDto} from "./UserInfoDto";
import {MaterialRequestDto} from "./MaterialRequestDto";

export interface MaterialPurchaseDto {
    id: number | null;
    materialDto: MaterialDto;
    managerDto: UserInfoDto;
    materialRequestDto: MaterialRequestDto | null;
    details: string | null;
    lotNo: string | null;
    price: number;
    quantity: number;
    status: PurchaseStatus | null;
}