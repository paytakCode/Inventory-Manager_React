import React, {useEffect, useState} from "react";
import {
    addProductMaterial,
    deleteProductMaterial,
    getProductMaterialContentList,
    updateProductMaterial
} from "services/productService";
import Table from 'react-bootstrap/Table';
import {Form, Modal} from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import {getCurrentUserInfo} from "services/userService";
import {ProductMaterialDto} from "components/Base/ProductMaterialDto";
import {ProductMaterialContentDto} from "components/ProductMaterialContentDto";
import {ProductMaterialIdDto} from "../../components/Base/ProductMaterialIdDto";
import {MaterialDto} from "../../components/Base/MaterialDto";
import {getMaterialContentList, getMaterialList} from "../../services/materialService";
import {MaterialContentDto} from "../../components/MaterialContentDto";

const ProductMaterialContent = () => {
    const currentUserInfo = getCurrentUserInfo();
    const [productMaterialContentList, setProductMaterialContentList] = useState<ProductMaterialContentDto[]>([]);
    const [materialContentMap, setMaterialContentMap] = useState<Map<number, MaterialContentDto>>(new Map<number, MaterialContentDto>());
    const [productMaterialListMap, setProductMaterialListMap] = useState<Map<number, ProductMaterialDto[]>>(new Map<number, ProductMaterialDto[]>());
    const [materialList, setMaterialList] = useState<MaterialDto[]>([]);
    const [productQuantity, setProductQuantity] = useState(1);
    const [show, setShow] = useState(false);
    const [showBom, setShowBom] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const [selectedProductName, setSelectedProductName] = useState<string | null>(null);
    const [editingProductMaterialId, setEditingProductMaterialId] = useState<ProductMaterialIdDto | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const initialValues = {
        productMaterialIdDto: {
            productDto: {
                name: ""
            },
            materialDto: {
                spec: ""
            }
        },
        requiredQuantity: 0
    } as ProductMaterialDto;
    const [formValues, setFormValues] = useState<ProductMaterialDto>(initialValues);
    let modalTitle;
    if (editingProductMaterialId) {
        modalTitle = isEditMode ? "제품 자재 수정" : "제품 자재 정보";
    } else {
        modalTitle = "제품 자재 추가";
    }

    const fetchProductMaterialContentList = async () => {
        try {
            const fetchedProductMaterialContentList = await getProductMaterialContentList();

            const updatedProductMaterialListMap = new Map<number, ProductMaterialDto[]>();
            for (const productMaterialContent of fetchedProductMaterialContentList) {
                updatedProductMaterialListMap.set(productMaterialContent.productDto.id, productMaterialContent.productMaterialDtoList);
            }
            setProductMaterialContentList(fetchedProductMaterialContentList);
            setProductMaterialListMap(updatedProductMaterialListMap);
        } catch (error) {
            console.error("Failed to fetch productMaterialContent list:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchProductMaterialContentList();

                const fechedMaterialContentList = await getMaterialContentList();

                const updatedMaterialContentMap = new Map<number, MaterialContentDto>();
                for (const materialContent of fechedMaterialContentList) {
                    if (materialContent.id != null) {
                        updatedMaterialContentMap.set(materialContent.id, materialContent);
                    }
                }
                setMaterialContentMap(updatedMaterialContentMap);

                const fetchedMaterialList = await getMaterialList();
                setMaterialList(fetchedMaterialList);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };

        fetchData();
    }, []);

    const handleCloseBOM = () => {
        setSelectedProductId(null);
        setSelectedProductName(null);
        setShowBom(false);
    };

    const handleShowBOM = (productName: string, productId: number) => {
        setProductQuantity(1);
        setSelectedProductId(productId);
        setSelectedProductName(productName);
        setShowBom(true);
    };


    const submitAddProductMaterial = async () => {
        await addProductMaterial(formValues);
        setFormValues(initialValues);
        setShow(false);
        await fetchProductMaterialContentList();
    };

    const submitUpdateProductMaterial = async () => {
        if (editingProductMaterialId) {
            await updateProductMaterial(editingProductMaterialId, formValues);
            setFormValues(initialValues);
            setEditingProductMaterialId(null);
            setShow(false);
            await fetchProductMaterialContentList();
        }
    };

    const submitDeleteProductMaterial = async () => {
        if (editingProductMaterialId) {
            await deleteProductMaterial(editingProductMaterialId);
            setFormValues(initialValues);
            setEditingProductMaterialId(null);
            setShow(false);
            await fetchProductMaterialContentList();
        }
    };

    const handleClose = () => {
        setFormValues(initialValues);
        setEditingProductMaterialId(null);
        setIsEditMode(false);
        setShow(false);
    };

    const handleShowAdd = () => {
        setFormValues(initialValues);
        setIsEditMode(true);
        setEditingProductMaterialId(null);
        setShow(true);
    };

    const handleShowEdit = (productMaterialDto: ProductMaterialDto) => {
        setFormValues({
            productMaterialIdDto: productMaterialDto.productMaterialIdDto,
            requiredQuantity: productMaterialDto.requiredQuantity
        });
        setIsEditMode(false);
        setEditingProductMaterialId(productMaterialDto.productMaterialIdDto);
        setShow(true);
    };

    return (
        <>
            <div>ProductMaterialContent</div>

            <Modal show={showBom} onHide={handleCloseBOM}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedProductName}의 자재 목록</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {(currentUserInfo.role === "관리자" || currentUserInfo.role === "생산부") && (
                        <Button variant="primary" onClick={handleShowAdd}>
                            +
                        </Button>
                    )}
                    <Form>
                        <Form.Group className="mb-3" controlId="quantity">
                            <Form.Label>생산 예정 수량</Form.Label>
                            <Form.Control
                                type="number"
                                value={productQuantity}
                                onChange={(e) => setProductQuantity(parseInt(e.target.value))}
                            />
                        </Form.Group>
                    </Form>
                    {selectedProductId && productMaterialListMap.has(selectedProductId) && (
                        <Table striped bordered hover size="sm">
                            <thead>
                            <tr>
                                <th>자재명</th>
                                <th>규격</th>
                                <th>필요 수량</th>
                                <th>현재 수량</th>
                                <th>입고 예정</th>
                                <th>소모 예정</th>
                                <th>실제 수량</th>
                                <th>총 필요 수량</th>
                            </tr>
                            </thead>
                            <tbody>
                            {productMaterialListMap.get(selectedProductId)?.map((productMaterial) => (
                                <tr key={productMaterial.productMaterialIdDto.materialDto.id}
                                    onClick={() => handleShowEdit(productMaterial)}>
                                    <td>{productMaterial.productMaterialIdDto.materialDto.name}</td>
                                    <td>{productMaterial.productMaterialIdDto.materialDto.spec}</td>
                                    <td>{productMaterial.requiredQuantity}</td>
                                    <td>{materialContentMap.get(productMaterial.productMaterialIdDto.materialDto.id as number)?.currentQuantity}</td>
                                    <td>{materialContentMap.get(productMaterial.productMaterialIdDto.materialDto.id as number)?.expectedInboundQuantity}</td>
                                    <td>{materialContentMap.get(productMaterial.productMaterialIdDto.materialDto.id as number)?.plannedConsumptionQuantity}</td>
                                    <td>{materialContentMap.get(productMaterial.productMaterialIdDto.materialDto.id as number)?.actualQuantity}</td>
                                    <td>{productMaterial.requiredQuantity * productQuantity}</td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    )}
                </Modal.Body>
            </Modal>

            <Table striped bordered hover size="sm">
                <thead>
                <tr>
                    <th>제품명</th>
                    <th>규격</th>
                </tr>
                </thead>
                <tbody>
                {productMaterialContentList.map((productMaterialContent) => (
                    <tr key={productMaterialContent.productDto.id}
                        onClick={() => handleShowBOM(productMaterialContent.productDto.name, productMaterialContent.productDto.id || 0)}>
                        <td>{productMaterialContent.productDto.name}</td>
                        <td>{productMaterialContent.productDto.spec}</td>
                    </tr>
                ))}
                </tbody>
            </Table>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="name">
                            <Form.Label>자재명</Form.Label>
                            <Form.Control
                                as="select"
                                value={formValues.productMaterialIdDto.materialDto.id || 0}
                                onChange={(e) =>
                                    setFormValues({
                                        ...formValues,
                                        productMaterialIdDto: {
                                            productDto: {
                                                id: selectedProductId,
                                                name: "",
                                                spec: "",
                                                details: ""
                                            },
                                            materialDto: {
                                                id: parseInt(e.target.value),
                                                name: "",
                                                spec: "",
                                                details: "",
                                                supplierDto: null
                                            },
                                        },
                                    })
                                }
                                disabled={!isEditMode}
                            >
                                <option value="">자재를 선택해주세요</option>
                                {materialList.map((material) => (
                                    <option key={material.id} value={material.id || 0}>
                                        {material.name} - {material.spec}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="quantity">
                            <Form.Label>수량</Form.Label>
                            <Form.Control
                                type="number"
                                value={formValues.requiredQuantity}
                                onChange={(e) =>
                                    setFormValues({...formValues, requiredQuantity: parseInt(e.target.value)})
                                }
                                disabled={!isEditMode}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        {editingProductMaterialId ? "닫기" : "취소"}
                    </Button>
                    {(currentUserInfo.role === "관리자" || currentUserInfo.role === "자재부") && (
                        <>
                            {editingProductMaterialId && !isEditMode ? (
                                <>
                                    <Button
                                        variant="danger"
                                        onClick={async () => {
                                            if (window.confirm("정말로 이 자재을 삭제하시겠습니까?")) {
                                                await submitDeleteProductMaterial();
                                            }
                                        }}
                                    >
                                        삭제
                                    </Button>
                                    <Button variant="primary" onClick={() => setIsEditMode(true)}>
                                        수정
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    variant="primary"
                                    onClick={editingProductMaterialId ? submitUpdateProductMaterial : submitAddProductMaterial}
                                >
                                    {editingProductMaterialId ? "적용" : "추가"}
                                </Button>
                            )}
                        </>
                    )}
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ProductMaterialContent;
