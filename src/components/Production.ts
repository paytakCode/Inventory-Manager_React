import ProductionStatus from "./ProductionStatus";

export interface Production {
    id: number;
    productId: number;
    managerId: number;
    lotNo: string;
    details: string;
    quantity: number;
    targetDate: Date;
    completionDate: Date;
    status: ProductionStatus;
}