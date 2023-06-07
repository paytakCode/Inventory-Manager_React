import {MaterialDto} from "./MaterialDto";
import {ProductDto} from "./ProductDto";

export interface ProductMaterialIdDto {
    productDto: ProductDto;
    materialDto: MaterialDto;
}