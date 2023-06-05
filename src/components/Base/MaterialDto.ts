import {SupplierDto} from "./SupplierDto";

export interface MaterialDto {
    id: number | null;
    name: string;
    spec: string;
    details: string | null;
    supplierDto: SupplierDto | null;
}