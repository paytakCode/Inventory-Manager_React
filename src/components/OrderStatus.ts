enum OrderStatus {
    ORDER_CONFIRMED = "발주",
    READY_SHIPMENT = "출고대기",
    SHIPPED = "배송중",
    DELIVERED = "도착",
    COMPLETED = "처리완료",
    CANCELED = "발주취소"
}
export default OrderStatus;