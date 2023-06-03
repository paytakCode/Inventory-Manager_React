import OrderStatus from "components/OrderStatus";

export interface SalesOrder {
    id: number;
    productId: number;
    quantity: number;
    managerId: number;
    buyerId: number;
    dueDate: Date;
    completionDate: Date;
    status: OrderStatus;
}