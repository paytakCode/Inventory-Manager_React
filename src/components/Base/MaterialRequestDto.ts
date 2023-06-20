import {MaterialDto} from "components/Base/MaterialDto";
import {UserInfoDto} from "components/Base/UserInfoDto";
import {MaterialPurchaseDto} from "components/Base/MaterialPurchaseDto";

export interface MaterialRequestDto {
    id: number | null;
    materialDto: MaterialDto;
    requesterDto: UserInfoDto;
    quantity: number;
    details: string | null;
    requestDate: Date | null;
    materialPurchaseDto: MaterialPurchaseDto | null;
}