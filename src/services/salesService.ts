import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const getSalesOrderList = async () => {
    try {
        const response = await axios.get(API_BASE_URL + '/sales-orders', {
            headers: {
                Authorization: Cookies.get("jwt") as string
            }
        });
        if (response.status === 200) {
            const salesOrderList = response.data;
            return salesOrderList;
        }
    } catch (error) {
        alert('Load SalesOrderList Failed' + error);
    }
}
const getBuyerList = async () => {
    try {
        const response = await axios.get(API_BASE_URL + '/buyers', {
            headers: {
                Authorization: Cookies.get("jwt") as string
            }
        });
        if (response.status === 200) {
            const buyerList = response.data;
            return buyerList;
        }
    } catch (error) {
        alert('Load BuyerList Failed' + error);
    }
}

export {getSalesOrderList, getBuyerList};