import React, { useEffect, useState } from "react";
import { getProductionList } from "services/productService";
import type {Production} from "components/Production";

const ProductionContent = () => {
    const [productionList, setProductionList] = useState<Production[]>([]);

    useEffect(() => {
        const fetchProductionList = async () => {
            try {
                const fetchedProductionList = await getProductionList();
                setProductionList(fetchedProductionList);
            } catch (error) {
                console.error("Failed to fetch production list:", error);
            }
        };

        fetchProductionList();
    }, []);

    return (
        <>
            <div>메인 컨테이너</div>
            <div>ProductionContent</div>
            <table>
                <thead>
                <tr>
                    <th>productId</th>
                    <th>managerId</th>
                    <th>lotNo</th>
                    <th>details</th>
                    <th>quantity</th>
                    <th>targetDate</th>
                    <th>completionDate</th>
                    <th>status</th>
                </tr>
                </thead>
                <tbody>
                {productionList.map((production) => (
                    <tr key={production.id}>
                        <td>{production.productId}</td>
                        <td>{production.managerId}</td>
                        <td>{production.lotNo}</td>
                        <td>{production.details}</td>
                        <td>{production.quantity}</td>
                        <td>{production.targetDate.toString()}</td>
                        <td>{production.completionDate.toString()}</td>
                        <td>{production.status}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    );
};

export default ProductionContent;
