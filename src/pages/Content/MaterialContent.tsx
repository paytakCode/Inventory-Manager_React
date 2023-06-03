import React, { useEffect, useState } from "react";
import { getMaterialList } from "services/materialService";
import type {Material} from "components/Material";

const MaterialContent = () => {
    const [materialList, setMaterialList] = useState<Material[]>([]);

    useEffect(() => {
        const fetchMaterialList = async () => {
            try {
                const fetchedMaterialList = await getMaterialList();
                setMaterialList(fetchedMaterialList);
            } catch (error) {
                console.error("Failed to fetch material list:", error);
            }
        };

        fetchMaterialList();
    }, []);

    return (
        <>
            <div>메인 컨테이너</div>
            <div>MaterialContent</div>
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Spec</th>
                    <th>Details</th>
                    <th>Supplier ID</th>
                </tr>
                </thead>
                <tbody>
                {materialList.map((material) => (
                    <tr key={material.id}>
                        <td>{material.name}</td>
                        <td>{material.spec}</td>
                        <td>{material.details}</td>
                        <td>{material.supplierId}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    );
};

export default MaterialContent;
