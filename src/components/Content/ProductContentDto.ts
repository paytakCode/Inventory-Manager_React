import {ProductDto} from "components/Base/ProductDto";

export interface ProductContentDto extends ProductDto {
    currentQuantity: number;
    inProductionQuantity: number;
    plannedOutboundQuantity: number;
    actualQuantity: number;
}