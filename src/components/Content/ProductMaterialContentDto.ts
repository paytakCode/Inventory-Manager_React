import {ProductDto} from "components/Base/ProductDto";
import {ProductMaterialDto} from "components/Base/ProductMaterialDto";

export interface ProductMaterialContentDto {
    productDto: ProductDto;
    productMaterialDtoList: ProductMaterialDto[];
}