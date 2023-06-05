import React, { useEffect, useState } from "react";
import { getBuyerList } from "services/salesService";
import type {BuyerDto} from "components/Base/BuyerDto";

const BuyerContent = () => {
    const [buyerList, setBuyerList] = useState<BuyerDto[]>([]);

    useEffect(() => {
        const fetchBuyerList = async () => {
            try {
                const fetchedBuyerList = await getBuyerList();
                setBuyerList(fetchedBuyerList);
            } catch (error) {
                console.error("Failed to fetch buyer list:", error);
            }
        };

        fetchBuyerList();
    }, []);

    return (
        <>
            <div>메인 컨테이너</div>
            <div>BuyerContent</div>
            <table>
                <thead>
                <tr>
                    <th>companyName</th>
                    <th>loc</th>
                    <th>managerName</th>
                    <th>tel</th>
                </tr>
                </thead>
                <tbody>
                {buyerList.map((buyer) => (
                    <tr key={buyer.id}>
                        <td>{buyer.companyName}</td>
                        <td>{buyer.loc}</td>
                        <td>{buyer.managerName}</td>
                        <td>{buyer.tel}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    );
};

export default BuyerContent;
