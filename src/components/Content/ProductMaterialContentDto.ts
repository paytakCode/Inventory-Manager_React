import {ProductDto} from "../Base/ProductDto";
import {ProductMaterialDto} from "../Base/ProductMaterialDto";

export interface ProductMaterialContentDto {
    productDto: ProductDto;
    productMaterialDtoList: ProductMaterialDto[];
}