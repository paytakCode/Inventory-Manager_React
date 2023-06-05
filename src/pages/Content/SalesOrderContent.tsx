import React, {useEffect, useState} from "react";
import {SalesOrderDto} from "components/Base/SalesOrderDto";
import {getSalesOrderList} from "services/salesService";

const SalesOrderContent = () => {
    const [salesOrderList, setSalesOrderList] = useState<SalesOrderDto[]>([]);

    useEffect(() => {
        const fetchSalesOrderList = async () => {
            try {
                const fetchedSalesOrderList = await getSalesOrderList();
                setSalesOrderList(fetchedSalesOrderList);
            } catch (error) {
                console.error("Failed to fetch salesOrder list:", error);
            }
        };

        fetchSalesOrderList();
    }, []);

    return (
        <>
            <div>메인 컨테이너</div>
            <div>SalesOrderContent</div>
            <table>
                <thead>
                <tr>
                    <th>productId</th>
                    <th>quantity</th>
                    <th>managerId</th>
                    <th>buyerId</th>
                    <th>dueDate</th>
                    <th>completionDate</th>
                    <th>status</th>
                </tr>
                </thead>
                <tbody>
                {salesOrderList.map((salesOrder) => (
                    <tr key={salesOrder.id}>
                        <td>{salesOrder.productDto?.name}</td>
                        <td>{salesOrder.quantity}</td>
                        <td>{salesOrder.managerDto?.name}</td>
                        <td>{salesOrder.buyerDto?.companyName}</td>
                        <td>{salesOrder.dueDate?.toString()}</td>
                        <td>{salesOrder.completionDate?.toString()}</td>
                        <td>{salesOrder.status}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    );
};


export default SalesOrderContent;