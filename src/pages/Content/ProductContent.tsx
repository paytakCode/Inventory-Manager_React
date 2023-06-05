import React, { useEffect, useState } from "react";
import { getProductList } from "services/productService";
import type {ProductDto} from "components/Base/ProductDto";

const ProductContent = () => {
    const [productList, setProductList] = useState<ProductDto[]>([]);

    useEffect(() => {
        const fetchProductList = async () => {
            try {
                const fetchedProductList = await getProductList();
                setProductList(fetchedProductList);
            } catch (error) {
                console.error("Failed to fetch product list:", error);
            }
        };

        fetchProductList();
    }, []);

    return (
        <>
            <div>메인 컨테이너</div>
            <div>ProductContent</div>
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Spec</th>
                    <th>Details</th>
                </tr>
                </thead>
                <tbody>
                {productList.map((product) => (
                    <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>{product.spec}</td>
                        <td>{product.details}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    );
};

export default ProductContent;
