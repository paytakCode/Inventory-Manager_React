import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const getMaterialList = async () => {
    try {
        const response = await axios.get(API_BASE_URL + '/materials', {
            headers: {
                Authorization: Cookies.get("jwt") as string
            }
        });
        if (response.status === 200) {
            const materialList = response.data;
            return materialList;
        }
    } catch (error) {
        alert('Load MaterialList Failed' + error);
    }
}
const getMaterialRequestList = async () => {
    try {
        console.log(API_BASE_URL);
        const response = await axios.get(API_BASE_URL + '/material-requests', {
            headers: {
                Authorization: Cookies.get("jwt") as string
            }
        });
        if (response.status === 200) {
            const materialRequestList = response.data;
            return materialRequestList;
        }
    } catch (error) {
        alert('Load MaterialRequestList Failed' + error);
    }
}
const getMaterialPurchaseList = async () => {
    try {
        console.log(API_BASE_URL);
        const response = await axios.get(API_BASE_URL + '/material-purchases', {
            headers: {
                Authorization: Cookies.get("jwt") as string
            }
        });
        if (response.status === 200) {
            const MaterialPurchaseList = response.data;
            return MaterialPurchaseList;
        }
    } catch (error) {
        alert('Load MaterialPurchaseList Failed' + error);
    }
}
const getSupplierList = async () => {
    try {
        const response = await axios.get(API_BASE_URL + '/suppliers', {
            headers: {
                Authorization: Cookies.get("jwt") as string
            }
        });
        if (response.status === 200) {
            const supplierList = response.data;
            return supplierList;
        }
    } catch (error) {
        alert('Load SupplierList Failed' + error);
    }
}

export {getMaterialList, getMaterialRequestList, getMaterialPurchaseList, getSupplierList};