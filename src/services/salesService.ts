import axios from "axios";
import Cookies from "js-cookie";
import {BuyerContentDto} from "../components/BuyerContentDto";
import {BuyerDto} from "../components/Base/BuyerDto";
import {SalesOrderDto} from "../components/Base/SalesOrderDto";
import {SalesOrderContentDto} from "../components/SalesOrderContentDto";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
export const getSalesOrderList = async () => {
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
export const getBuyerList = async () => {
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

export const getBuyerContentList = async(): Promise <BuyerContentDto[]>  => {
    console.log("getBuyerContentList");
    try {
        const response = await axios.get(API_BASE_URL + '/buyer-contents', {
            headers: {
                Authorization: Cookies.get("jwt") as string
            }
        });
        if (response.status === 200) {
            const buyerContentList = response.data;
            return buyerContentList;
        } else {
            throw new Error('Failed to fetch buyer Content list');
        }
    } catch (error) {
        alert('Load buyerContentList Failed' + error);
        throw error;
    }
}

export const addBuyer = async (buyerDto: BuyerDto) => {
    console.log("addBuyer");
    try {
        const response = await axios.post(
            API_BASE_URL + '/sales/buyers',
            buyerDto,
            {
                headers: {
                    Authorization: Cookies.get('jwt') as string,
                    'Content-Type': 'application/json',
                },
            }
        );
        if (response.status === 201) {
            console.log('Buyer Added successfully');
        } else {
            console.error('Failed to add the Buyer');
        }
    } catch (error) {
        console.error('Failed to add the Buyer:', error);
    }
};

export const updateBuyer = async (buyerId:number, buyerDto: BuyerDto) => {
    console.log("updateBuyer");
    try {
        const response = await axios.put(
            API_BASE_URL + '/sales/buyers/' + buyerId,
            buyerDto,
            {
                headers: {
                    Authorization: Cookies.get('jwt') as string,
                    'Content-Type': 'application/json',
                },
            }
        );
        if (response.status === 204) {
            console.log('Buyer updated successfully');
        } else {
            console.error('Failed to update the Buyer');
        }
    } catch (error) {
        console.error('Failed to update the Buyer:', error);
    }
};

export const deleteBuyer = async (buyerId:number) => {
    console.log("deleteBuyer");
    try {
        const response = await axios.delete(
            API_BASE_URL + '/sales/buyers/' + buyerId,
            {
                headers: {
                    Authorization: Cookies.get('jwt') as string,
                    'Content-Type': 'application/json',
                },
            }
        );
        if (response.status === 204) {
            console.log('Buyer deleted successfully');
        } else {
            console.error('Failed to delete the Buyer');
        }
    } catch (error) {
        console.error('Failed to delete the Buyer:', error);
    }
};

export const getSalesOrderContentList = async(): Promise <SalesOrderContentDto[]>  => {
    console.log("getSalesOrderContentList");
    try {
        const response = await axios.get(API_BASE_URL + '/sales-order-contents', {
            headers: {
                Authorization: Cookies.get("jwt") as string
            }
        });
        if (response.status === 200) {
            const salesOrderContentList = response.data;
            return salesOrderContentList;
        } else {
            throw new Error('Failed to fetch salesOrder Content list');
        }
    } catch (error) {
        alert('Load salesOrderContentList Failed' + error);
        throw error;
    }
}

export const addSalesOrder = async (salesOrderDto: SalesOrderDto) => {
    console.log("addSalesOrder");
    try {
        const response = await axios.post(
            API_BASE_URL + '/sales/salesOrders',
            salesOrderDto,
            {
                headers: {
                    Authorization: Cookies.get('jwt') as string,
                    'Content-Type': 'application/json',
                },
            }
        );
        if (response.status === 201) {
            console.log('SalesOrder Added successfully');
        } else {
            console.error('Failed to add the SalesOrder');
        }
    } catch (error) {
        console.error('Failed to add the SalesOrder:', error);
    }
};

export const updateSalesOrder = async (salesOrderId:number, salesOrderDto: SalesOrderDto) => {
    console.log("updateSalesOrder");
    try {
        const response = await axios.put(
            API_BASE_URL + '/sales/salesOrders/' + salesOrderId,
            salesOrderDto,
            {
                headers: {
                    Authorization: Cookies.get('jwt') as string,
                    'Content-Type': 'application/json',
                },
            }
        );
        if (response.status === 204) {
            console.log('SalesOrder updated successfully');
        } else {
            console.error('Failed to update the SalesOrder');
        }
    } catch (error) {
        console.error('Failed to update the SalesOrder:', error);
    }
};

export const deleteSalesOrder = async (salesOrderId:number) => {
    console.log("deleteSalesOrder");
    try {
        const response = await axios.delete(
            API_BASE_URL + '/sales/salesOrders/' + salesOrderId,
            {
                headers: {
                    Authorization: Cookies.get('jwt') as string,
                    'Content-Type': 'application/json',
                },
            }
        );
        if (response.status === 204) {
            console.log('SalesOrder deleted successfully');
        } else {
            console.error('Failed to delete the SalesOrder');
        }
    } catch (error) {
        console.error('Failed to delete the SalesOrder:', error);
    }
};