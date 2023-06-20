import axios from "axios";
import Cookies from "js-cookie";
import {ProductionDto} from "components/Base/ProductionDto";
import {ProductDto} from "components/Base/ProductDto";
import {ProductMaterialDto} from "components/Base/ProductMaterialDto";
import {ProductMaterialIdDto} from "components/Base/ProductMaterialIdDto";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
export const getProductList = async () => {
    try {
        const response = await axios.get(API_BASE_URL + '/products', {
            headers: {
                Authorization: Cookies.get("jwt") as string
            }
        });
        if (response.status === 200) {
            const productList = response.data;
            return productList;
        }
    } catch (error) {
        alert('Load ProductList Failed' + error);
    }
}

export const getProductContentList = async () => {
    try {
        const response = await axios.get(API_BASE_URL + '/product-contents', {
            headers: {
                Authorization: Cookies.get("jwt") as string
            }
        });
        if (response.status === 200) {
            const productContentList = response.data;
            return productContentList;
        }
    } catch (error) {
        alert('Load ProductContentList Failed' + error);
    }
}

export const getProductionList = async () => {
    try {
        const response = await axios.get(API_BASE_URL + '/productions', {
            headers: {
                Authorization: Cookies.get("jwt") as string
            }
        });
        if (response.status === 200) {
            const productionList = response.data;
            return productionList;
        }
    } catch (error) {
        alert('Load ProductionList Failed' + error);
    }
}

export const getProductionContentList = async () => {
    try {
        const response = await axios.get(API_BASE_URL + '/production-contents', {
            headers: {
                Authorization: Cookies.get("jwt") as string
            }
        });
        if (response.status === 200) {
            const productionContentList = response.data;
            return productionContentList;
        }
    } catch (error) {
        alert('Load ProductionContentList Failed' + error);
    }
}
export const getProductMaterialList = async () => {
    try {
        console.log(API_BASE_URL);
        const response = await axios.get(API_BASE_URL + '/product-materials', {
            headers: {
                Authorization: Cookies.get("jwt") as string
            }
        });
        if (response.status === 200) {
            const productMaterialList = response.data;
            return productMaterialList;
        }
    } catch (error) {
        alert('Load productMaterialList Failed' + error);
    }
}

export const getProductMaterialContentList = async () => {
    try {
        const response = await axios.get(API_BASE_URL + '/product-material-contents', {
            headers: {
                Authorization: Cookies.get("jwt") as string
            }
        });
        if (response.status === 200) {
            const productMaterialContentList = response.data;
            return productMaterialContentList;
        }
    } catch (error) {
        alert('Load ProductMaterialContentList Failed' + error);
    }
}


export const addProduct = async (productDto: ProductDto) => {
    console.log("addProduct");
    try {
        const response = await axios.post(
            API_BASE_URL + '/production/products',
            productDto,
            {
                headers: {
                    Authorization: Cookies.get('jwt') as string,
                    'Content-Type': 'application/json',
                },
            }
        );
        if (response.status === 201) {
            console.log('Product Added successfully');
        } else {
            console.error('Failed to add the Product');
        }
    } catch (error) {
        console.error('Failed to add the Product:', error);
    }
};

export const updateProduct = async (productId: number, productDto: ProductDto) => {
    console.log("updateProduct");
    try {
        const response = await axios.put(
            API_BASE_URL + '/production/products/' + productId,
            productDto,
            {
                headers: {
                    Authorization: Cookies.get('jwt') as string,
                    'Content-Type': 'application/json',
                },
            }
        );
        if (response.status === 204) {
            console.log('Product updated successfully');
        } else {
            console.error('Failed to update the Product');
        }
    } catch (error) {
        console.error('Failed to update the Product:', error);
    }
};

export const deleteProduct = async (productId: number) => {
    console.log("deleteProduct");
    try {
        const response = await axios.delete(
            API_BASE_URL + '/production/products/' + productId,
            {
                headers: {
                    Authorization: Cookies.get('jwt') as string,
                    'Content-Type': 'application/json',
                },
            }
        );
        if (response.status === 204) {
            console.log('Product deleted successfully');
        } else {
            console.error('Failed to delete the Product');
        }
    } catch (error) {
        console.error('Failed to delete the Product:', error);
    }
};

export const addProduction = async (productionDto: ProductionDto) => {
    console.log("addProduction");
    try {
        const response = await axios.post(
            API_BASE_URL + '/production/productions',
            productionDto,
            {
                headers: {
                    Authorization: Cookies.get('jwt') as string,
                    'Content-Type': 'application/json',
                },
            }
        );
        if (response.status === 201) {
            console.log('Production Added successfully');
        } else {
            console.error('Failed to add the Production');
        }
    } catch (error) {
        console.error('Failed to add the Production:', error);
    }
};

export const updateProduction = async (productionId: number, productionDto: ProductionDto) => {
    console.log("updateProduction");
    try {
        const response = await axios.put(
            API_BASE_URL + '/production/productions/' + productionId,
            productionDto,
            {
                headers: {
                    Authorization: Cookies.get('jwt') as string,
                    'Content-Type': 'application/json',
                },
            }
        );
        if (response.status === 204) {
            console.log('Production updated successfully');
        } else {
            console.error('Failed to update the Production');
        }
    } catch (error) {
        console.error('Failed to update the Production:', error);
    }
};

export const deleteProduction = async (productionId: number) => {
    console.log("deleteProduction");
    try {
        const response = await axios.delete(
            API_BASE_URL + '/production/productions/' + productionId,
            {
                headers: {
                    Authorization: Cookies.get('jwt') as string,
                    'Content-Type': 'application/json',
                },
            }
        );
        if (response.status === 204) {
            console.log('Production deleted successfully');
        } else {
            console.error('Failed to delete the Production');
        }
    } catch (error) {
        console.error('Failed to delete the Production:', error);
    }
};

export const addProductMaterial = async (productMaterialDto: ProductMaterialDto) => {
    console.log("addProductMaterial");
    try {
        const response = await axios.post(
            API_BASE_URL + '/production/product-materials',
            productMaterialDto,
            {
                headers: {
                    Authorization: Cookies.get('jwt') as string,
                    'Content-Type': 'application/json',
                },
            }
        );
        if (response.status === 201) {
            console.log('ProductMaterial Added successfully');
        } else {
            console.error('Failed to add the ProductMaterial');
        }
    } catch (error) {
        console.error('Failed to add the ProductMaterial:', error);
    }
};

export const updateProductMaterial = async (productMaterialIdDto: ProductMaterialIdDto, productMaterialDto: ProductMaterialDto) => {
    console.log("updateProductMaterial");
    try {
        const response = await axios.put(
            API_BASE_URL + '/production/product-materials/' + productMaterialIdDto.productDto.id + "/" + productMaterialIdDto.materialDto.id,
            productMaterialDto,
            {
                headers: {
                    Authorization: Cookies.get('jwt') as string,
                    'Content-Type': 'application/json',
                },
            }
        );
        if (response.status === 204) {
            console.log('ProductMaterial updated successfully');
        } else {
            console.error('Failed to update the ProductMaterial');
        }
    } catch (error) {
        console.error('Failed to update the ProductMaterial:', error);
    }
};

export const deleteProductMaterial = async (productMaterialIdDto: ProductMaterialIdDto) => {
    console.log("deleteProductMaterial");
    try {
        const response = await axios.delete(
            API_BASE_URL + '/production/product-materials/' + productMaterialIdDto.productDto.id + "/" + productMaterialIdDto.materialDto.id,
            {
                headers: {
                    Authorization: Cookies.get('jwt') as string,
                    'Content-Type': 'application/json',
                },
            }
        );
        if (response.status === 204) {
            console.log('ProductMaterial deleted successfully');
        } else {
            console.error('Failed to delete the ProductMaterial');
        }
    } catch (error) {
        console.error('Failed to delete the ProductMaterial:', error);
    }
};
