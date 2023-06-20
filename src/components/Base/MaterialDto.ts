import {SupplierDto} from "components/Base/SupplierDto";

export interface MaterialDto {
    id: number | null;
    name: string;
    spec: string;
    details: string | null;
    supplierDto: SupplierDto | null;
}