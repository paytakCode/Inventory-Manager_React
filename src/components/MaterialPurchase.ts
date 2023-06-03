import PurchaseStatus from "components/PurchaseStatus";

export interface MaterialPurchase {
    id: number;
    materialId: number;
    managerId: number;
    materialRequestId: number;
    details: string;
    lotNo: string;
    price: number;
    quantity: number;
    status: PurchaseStatus;
}