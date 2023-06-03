import React, { useEffect, useState } from "react";
import {getMaterialPurchaseList} from "services/materialService";
import type {MaterialPurchase} from "components/MaterialPurchase";

const MaterialPurchaseContent = () => {
    const [materialPurchaseList, setMaterialPurchaseList] = useState<MaterialPurchase[]>([]);

    useEffect(() => {
        const fetchMaterialPurchaseList = async () => {
            try {
                const fetchedMaterialPurchaseList = await getMaterialPurchaseList();
                setMaterialPurchaseList(fetchedMaterialPurchaseList);
            } catch (error) {
                console.error("Failed to fetch materialPurchase list:", error);
            }
        };

        fetchMaterialPurchaseList();
    }, []);

    return (
        <>
            <div>메인 컨테이너</div>
            <div>MaterialPurchaseContent</div>
            <table>
                <thead>
                <tr>
                    <th>materialId</th>
                    <th>managerId</th>
                    <th>materialRequestId</th>
                    <th>details</th>
                    <th>lotNo</th>
                    <th>price</th>
                    <th>quantity</th>
                    <th>status</th>
                </tr>
                </thead>
                <tbody>
                {materialPurchaseList.map((materialPurchase) => (
                    <tr key={materialPurchase.id}>
                        <td>{materialPurchase.materialId}</td>
                        <td>{materialPurchase.managerId}</td>
                        <td>{materialPurchase.materialRequestId}</td>
                        <td>{materialPurchase.details}</td>
                        <td>{materialPurchase.lotNo}</td>
                        <td>{materialPurchase.price}</td>
                        <td>{materialPurchase.quantity}</td>
                        <td>{materialPurchase.status}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    );
};

export default MaterialPurchaseContent;
