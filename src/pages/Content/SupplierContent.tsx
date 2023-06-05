import React, { useEffect, useState } from "react";
import { getSupplierList } from "services/materialService";
import type {SupplierDto} from "components/Base/SupplierDto";

const SupplierContent = () => {
    const [supplierList, setSupplierList] = useState<SupplierDto[]>([]);

    useEffect(() => {
        const fetchSupplierList = async () => {
            try {
                const fetchedSupplierList = await getSupplierList();
                setSupplierList(fetchedSupplierList);
            } catch (error) {
                console.error("Failed to fetch supplier list:", error);
            }
        };

        fetchSupplierList();
    }, []);

    return (
        <>
            <div>메인 컨테이너</div>
            <div>SupplierContent</div>
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
                {supplierList.map((supplier) => (
                    <tr key={supplier.id}>
                        <td>{supplier.companyName}</td>
                        <td>{supplier.loc}</td>
                        <td>{supplier.managerName}</td>
                        <td>{supplier.tel}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    );
};

export default SupplierContent;
