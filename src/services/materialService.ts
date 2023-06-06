import axios from "axios";
import Cookies from "js-cookie";
import {MaterialDto} from "../components/Base/MaterialDto";
import {MaterialRequestDto} from "../components/Base/MaterialRequestDto";
import {MaterialPurchaseDto} from "../components/Base/MaterialPurchaseDto";
import {SupplierDto} from "../components/Base/SupplierDto";
import {MaterialContentDto} from "../components/MaterialContentDto";
import {MaterialRequestContentDto} from "../components/MaterialRequestContentDto";
import {MaterialPurchaseContentDto} from "../components/MaterialPurchaseContentDto";
import {SupplierContentDto} from "../components/SupplierContentDto";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
export const getMaterialList = async (): Promise<MaterialDto[]>  => {
    console.log("getMaterialList");
    try {
        const response = await axios.get(API_BASE_URL + '/materials', {
            headers: {
                Authorization: Cookies.get("jwt") as string
            }
        });
        if (response.status === 200) {
            const materialList = response.data;
            return materialList;
        } else {
            throw new Error('Failed to fetch material list');
        }
    } catch (error) {
        console.error('Load MaterialList Failed', error);
        throw error;
    }
}
export const getMaterialRequestList = async (): Promise<MaterialRequestDto[]>   => {
    console.log("getMaterialRequestList");
    try {
        const response = await axios.get(API_BASE_URL + '/material-requests', {
            headers: {
                Authorization: Cookies.get("jwt") as string
            }
        });
        if (response.status === 200) {
            const materialRequestList = response.data;
            return materialRequestList;
        } else {
            throw new Error('Failed to fetch material request list');
        }
    } catch (error) {
        alert('Load MaterialRequestList Failed' + error);
        throw error;
    }
}
export const getMaterialPurchaseList = async (): Promise<MaterialPurchaseDto[]> => {
    console.log("getMaterialPurchaseList");
    try {
        const response = await axios.get(API_BASE_URL + '/material-purchases', {
            headers: {
                Authorization: Cookies.get("jwt") as string
            }
        });
        if (response.status === 200) {
            const materialPurchaseList = response.data;
            return materialPurchaseList;
        } else {
            throw new Error('Failed to fetch material purchase list');
        }
    } catch (error) {
        alert('Load MaterialPurchaseList Failed' + error);
        throw error;
    }
}
export const getSupplierList = async (): Promise <SupplierDto[]> => {
    console.log("getSupplierList");
    try {
        const response = await axios.get(API_BASE_URL + '/suppliers', {
            headers: {
                Authorization: Cookies.get("jwt") as string
            }
        });
        if (response.status === 200) {
            const supplierList = response.data;
            return supplierList;
        } else {
            throw new Error('Failed to fetch material purchase list');
        }
    } catch (error) {
        alert('Load SupplierList Failed' + error);
        throw error;
    }
}

export const getMaterialContentList = async(): Promise <MaterialContentDto[]>  => {
    console.log("getMaterialContentList");
    try {
        const response = await axios.get(API_BASE_URL + '/material-contents', {
            headers: {
                Authorization: Cookies.get("jwt") as string
            }
        });
        if (response.status === 200) {
            const materialContentList = response.data;
            return materialContentList;
        } else {
            throw new Error('Failed to fetch material content list');
        }
    } catch (error) {
        alert('Load materialContentList Failed' + error);
        throw error;
    }
}

export const getMaterialRequestContentList = async(): Promise <MaterialRequestContentDto[]>  => {
    console.log("getMaterialRequestContentList");
    try {
        const response = await axios.get(API_BASE_URL + '/material-request-contents', {
            headers: {
                Authorization: Cookies.get("jwt") as string
            }
        });
        if (response.status === 200) {
            const materialRequestContentList = response.data;
            return materialRequestContentList;
        } else {
            throw new Error('Failed to fetch material Request content list');
        }
    } catch (error) {
        alert('Load materialRequestContentList Failed' + error);
        throw error;
    }
}

export const getMaterialPurchaseContentList = async(): Promise <MaterialPurchaseContentDto[]>  => {
    console.log("getMaterialPurchaseContentList");
    try {
        const response = await axios.get(API_BASE_URL + '/material-purchase-contents', {
            headers: {
                Authorization: Cookies.get("jwt") as string
            }
        });
        if (response.status === 200) {
            const materialPurchaseContentList = response.data;
            return materialPurchaseContentList;
        } else {
            throw new Error('Failed to fetch material Purchase content list');
        }
    } catch (error) {
        alert('Load materialPurchaseContentList Failed' + error);
        throw error;
    }
}

export const getSupplierContentList = async(): Promise <SupplierContentDto[]>  => {
    console.log("getSupplierContentList");
    try {
        const response = await axios.get(API_BASE_URL + '/supplier-contents', {
            headers: {
                Authorization: Cookies.get("jwt") as string
            }
        });
        if (response.status === 200) {
            const supplierContentList = response.data;
            return supplierContentList;
        } else {
            throw new Error('Failed to fetch supplier Content list');
        }
    } catch (error) {
        alert('Load supplierContentList Failed' + error);
        throw error;
    }
}

export const addMaterial = async (materialDto: MaterialDto) => {
    console.log("addMaterial");
    try {
        const response = await axios.post(
            API_BASE_URL + '/material/materials',
            materialDto,
            {
                headers: {
                    Authorization: Cookies.get('jwt') as string,
                    'Content-Type': 'application/json',
                },
            }
        );
        if (response.status === 201) {
            console.log('Material Added successfully');
        } else {
            console.error('Failed to add the Material');
        }
    } catch (error) {
        console.error('Failed to add the Material:', error);
    }
};

export const updateMaterial = async (materialId:number, materialDto: MaterialDto) => {
    console.log("updateMaterial");
    try {
        const response = await axios.put(
            API_BASE_URL + '/material/materials/' + materialId,
            materialDto,
            {
                headers: {
                    Authorization: Cookies.get('jwt') as string,
                    'Content-Type': 'application/json',
                },
            }
        );
        if (response.status === 204) {
            console.log('Material updated successfully');
        } else {
            console.error('Failed to update the Material');
        }
    } catch (error) {
        console.error('Failed to update the Material:', error);
    }
};

export const deleteMaterial = async (materialId:number) => {
    console.log("deleteMaterial");
    try {
        const response = await axios.delete(
            API_BASE_URL + '/material/materials/' + materialId,
            {
                headers: {
                    Authorization: Cookies.get('jwt') as string,
                    'Content-Type': 'application/json',
                },
            }
        );
        if (response.status === 204) {
            console.log('Material deleted successfully');
        } else {
            console.error('Failed to delete the Material');
        }
    } catch (error) {
        console.error('Failed to delete the Material:', error);
    }
};

export const addMaterialRequest = async (materialRequestDto: MaterialRequestDto) => {
    console.log("addMaterialRequest");
    try {
        const response = await axios.post(
            API_BASE_URL + '/production/material-requests',
            materialRequestDto,
            {
                headers: {
                    Authorization: Cookies.get('jwt') as string,
                    'Content-Type': 'application/json',
                },
            }
        );
        if (response.status === 201) {
            console.log('MaterialRequest Added successfully');
        } else {
            console.error('Failed to add the MaterialRequest');
        }
    } catch (error) {
        console.error('Failed to add the MaterialRequest:', error);
    }
};

export const updateMaterialRequest = async (materialRequestId:number, materialRequestDto: MaterialRequestDto) => {
    console.log("updateMaterialRequest");
    try {
        const response = await axios.put(
            API_BASE_URL + '/production/material-requests/' + materialRequestId,
            materialRequestDto,
            {
                headers: {
                    Authorization: Cookies.get('jwt') as string,
                    'Content-Type': 'application/json',
                },
            }
        );
        if (response.status === 204) {
            console.log('MaterialRequest updated successfully');
        } else {
            console.error('Failed to update the MaterialRequest');
        }
    } catch (error) {
        console.error('Failed to update the MaterialRequest:', error);
    }
};

export const deleteMaterialRequest = async (materialRequestId:number) => {
    console.log("deleteMaterialRequest");
    try {
        const response = await axios.delete(
            API_BASE_URL + '/production/material-requests/' + materialRequestId,
            {
                headers: {
                    Authorization: Cookies.get('jwt') as string,
                    'Content-Type': 'application/json',
                },
            }
        );
        if (response.status === 204) {
            console.log('MaterialRequest deleted successfully');
        } else {
            console.error('Failed to delete the MaterialRequest');
        }
    } catch (error) {
        console.error('Failed to delete the MaterialRequest:', error);
    }
};

export const addMaterialPurchase = async (materialPurchaseDto: MaterialPurchaseDto) => {
    console.log("addMaterialPurchase");
    try {
        const response = await axios.post(
            API_BASE_URL + '/material/material-purchases',
            materialPurchaseDto,
            {
                headers: {
                    Authorization: Cookies.get('jwt') as string,
                    'Content-Type': 'application/json',
                },
            }
        );
        if (response.status === 201) {
            console.log('MaterialPurchase Added successfully');
        } else {
            console.error('Failed to add the MaterialPurchase');
        }
    } catch (error) {
        console.error('Failed to add the MaterialPurchase:', error);
    }
};

export const updateMaterialPurchase = async (materialPurchaseId:number, materialPurchaseDto: MaterialPurchaseDto) => {
    console.log("updateMaterialPurchase");
    try {
        const response = await axios.put(
            API_BASE_URL + '/material/material-purchases/' + materialPurchaseId,
            materialPurchaseDto,
            {
                headers: {
                    Authorization: Cookies.get('jwt') as string,
                    'Content-Type': 'application/json',
                },
            }
        );
        if (response.status === 204) {
            console.log('MaterialPurchase updated successfully');
        } else {
            console.error('Failed to update the MaterialPurchase');
        }
    } catch (error) {
        console.error('Failed to update the MaterialPurchase:', error);
    }
};

export const deleteMaterialPurchase = async (materialPurchaseId:number) => {
    console.log("deleteMaterialPurchase");
    try {
        const response = await axios.delete(
            API_BASE_URL + '/material/material-purchases/' + materialPurchaseId,
            {
                headers: {
                    Authorization: Cookies.get('jwt') as string,
                    'Content-Type': 'application/json',
                },
            }
        );
        if (response.status === 204) {
            console.log('MaterialPurchase deleted successfully');
        } else {
            console.error('Failed to delete the MaterialPurchase');
        }
    } catch (error) {
        console.error('Failed to delete the MaterialPurchase:', error);
    }
};

export const addSupplier = async (supplierDto: SupplierDto) => {
    console.log("addSupplier");
    try {
        const response = await axios.post(
            API_BASE_URL + '/material/suppliers',
            supplierDto,
            {
                headers: {
                    Authorization: Cookies.get('jwt') as string,
                    'Content-Type': 'application/json',
                },
            }
        );
        if (response.status === 201) {
            console.log('Supplier Added successfully');
        } else {
            console.error('Failed to add the Supplier');
        }
    } catch (error) {
        console.error('Failed to add the Supplier:', error);
    }
};

export const updateSupplier = async (supplierId:number, supplierDto: SupplierDto) => {
    console.log("updateSupplier");
    try {
        const response = await axios.put(
            API_BASE_URL + '/material/suppliers/' + supplierId,
            supplierDto,
            {
                headers: {
                    Authorization: Cookies.get('jwt') as string,
                    'Content-Type': 'application/json',
                },
            }
        );
        if (response.status === 204) {
            console.log('Supplier updated successfully');
        } else {
            console.error('Failed to update the Supplier');
        }
    } catch (error) {
        console.error('Failed to update the Supplier:', error);
    }
};

export const deleteSupplier = async (supplierId:number) => {
    console.log("deleteSupplier");
    try {
        const response = await axios.delete(
            API_BASE_URL + '/material/suppliers/' + supplierId,
            {
                headers: {
                    Authorization: Cookies.get('jwt') as string,
                    'Content-Type': 'application/json',
                },
            }
        );
        if (response.status === 204) {
            console.log('Supplier deleted successfully');
        } else {
            console.error('Failed to delete the Supplier');
        }
    } catch (error) {
        console.error('Failed to delete the Supplier:', error);
    }
};
