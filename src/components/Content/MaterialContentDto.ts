import {MaterialDto} from "components/Base/MaterialDto";

export interface MaterialContentDto extends MaterialDto {
    currentQuantity: number;
    expectedInboundQuantity: number;
    plannedConsumptionQuantity: number;
    actualQuantity: number;
}