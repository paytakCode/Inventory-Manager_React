import {MaterialDto} from "./MaterialDto";
import {UserInfoDto} from "./UserInfoDto";
import {MaterialPurchaseDto} from "./MaterialPurchaseDto";

export interface MaterialRequestDto {
    id: number | null;
    materialDto: MaterialDto;
    requesterDto: UserInfoDto;
    quantity: number;
    details: string | null;
    requestDate : Date | null;
    materialPurchaseDto: MaterialPurchaseDto | null;
}