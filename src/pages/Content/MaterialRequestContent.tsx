import React, { useEffect, useState } from "react";
import { getMaterialRequestList } from "services/materialService";
import type {MaterialRequest} from "components/MaterialRequest";

const MaterialRequestContent = () => {
    const [materialRequestList, setMaterialRequestList] = useState<MaterialRequest[]>([]);

    useEffect(() => {
        const fetchMaterialRequestList = async () => {
            try {
                const fetchedMaterialRequestList = await getMaterialRequestList();
                setMaterialRequestList(fetchedMaterialRequestList);
            } catch (error) {
                console.error("Failed to fetch materialRequest list:", error);
            }
        };

        fetchMaterialRequestList();
    }, []);

    return (
        <>
            <div>메인 컨테이너</div>
            <div>MaterialRequestContent</div>
            <table>
                <thead>
                <tr>
                    <th>materialId</th>
                    <th>quantity</th>
                    <th>requesterId</th>
                    <th>details</th>
                    <th>materialPurchaseId</th>
                </tr>
                </thead>
                <tbody>
                {materialRequestList.map((materialRequest) => (
                    <tr key={materialRequest.id}>
                        <td>{materialRequest.materialId}</td>
                        <td>{materialRequest.quantity}</td>
                        <td>{materialRequest.requesterId}</td>
                        <td>{materialRequest.details}</td>
                        <td>{materialRequest.materialPurchaseId}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    );
};

export default MaterialRequestContent;
