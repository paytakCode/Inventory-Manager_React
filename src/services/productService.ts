import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const getProductList = async () => {
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
const getProductionList = async () => {
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
const getProductMaterialList = async () => {
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

export {getProductList, getProductMaterialList, getProductionList};