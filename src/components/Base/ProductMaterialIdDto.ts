import {MaterialDto} from "components/Base/MaterialDto";
import {ProductDto} from "components/Base/ProductDto";

export interface ProductMaterialIdDto {
    productDto: ProductDto;
    materialDto: MaterialDto;
}