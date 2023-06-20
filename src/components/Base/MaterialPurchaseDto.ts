import PurchaseStatus from "components/Base/PurchaseStatus";
import {MaterialDto} from "components/Base/MaterialDto";
import {UserInfoDto} from "components/Base/UserInfoDto";
import {MaterialRequestDto} from "components/Base/MaterialRequestDto";

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