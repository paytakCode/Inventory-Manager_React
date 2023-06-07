import React, {useEffect, useState} from "react";
import {addProduct, deleteProduct, getProductContentList, updateProduct} from "services/productService";
import Table from 'react-bootstrap/Table';
import {Form, Modal} from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import type {ProductContentDto} from "components/ProductContentDto";
import {getCurrentUserInfo} from "../../services/userService";
import {ProductDto} from "../../components/Base/ProductDto";

const ProductContent = () => {
    const currentUserInfo = getCurrentUserInfo();
    const [productContentList, setProductContentList] = useState<ProductContentDto[]>([]);
    const [show, setShow] = useState(false);
    const [editingProductId, setEditingProductId] = useState<number | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const initialValues = {
        name: "",
        spec: ""
    } as ProductDto;
    const [formValues, setFormValues] = useState<ProductDto>(initialValues);
    let modalTitle;
    if (editingProductId) {
        modalTitle = isEditMode ? "제품 수정" : "제품 정보";
    } else {
        modalTitle = "제품 추가";
    }

    const fetchProductContentList = async () => {
        try {
            const fetchedProductContentList = await getProductContentList();
            setProductContentList(fetchedProductContentList);
        } catch (error) {
            console.error("Failed to fetch product list:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchProductContentList();
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };

        fetchData();
    }, []);


    const submitAddProduct = async () => {
        await addProduct(formValues);
        setFormValues(initialValues);
        setShow(false);
        await fetchProductContentList();
    };

    const submitUpdateProduct = async () => {
        if (editingProductId) {
            await updateProduct(editingProductId, formValues);
            setFormValues(initialValues);
            setEditingProductId(null);
            setShow(false);
            await fetchProductContentList();
        }
    };

    const submitDeleteProduct = async () => {
        if (editingProductId) {
            await deleteProduct(editingProductId);
            setFormValues(initialValues);
            setEditingProductId(null);
            setShow(false);
            await fetchProductContentList();
        }
    };

    const handleClose = () => {
        setFormValues(initialValues);

        setEditingProductId(null);
        setShow(false);
    };

    const handleShowAdd = () => {
        setFormValues(initialValues);
        setIsEditMode(true);
        setEditingProductId(null);
        setShow(true);
    };

    const handleShowEdit = (productContent: ProductContentDto) => {
        setFormValues({
            id: productContent.id,
            name: productContent.name,
            spec: productContent.spec,
            details: productContent.details
        });

        setIsEditMode(false);
        setEditingProductId(productContent.id);
        setShow(true);
    };

    return (
        <>
            <div>ProductContent</div>
            {(currentUserInfo.role === "관리자" || currentUserInfo.role === "생산부") && (
                <Button variant="primary" onClick={handleShowAdd}>
                    +
                </Button>
            )}

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="name">
                            <Form.Label>제품명</Form.Label>
                            <Form.Control
                                type="text"
                                autoFocus
                                value={formValues.name}
                                onChange={(e) =>
                                    setFormValues({...formValues, name: e.target.value})
                                }
                                disabled={!isEditMode}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="spec">
                            <Form.Label>규격</Form.Label>
                            <Form.Control
                                type="text"
                                value={formValues.spec || ""}
                                onChange={(e) =>
                                    setFormValues({...formValues, spec: e.target.value})
                                }
                                disabled={!isEditMode}
                            />
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            controlId="details"
                        >
                            <Form.Label>상세정보</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={formValues.details || ""}
                                onChange={(e) =>
                                    setFormValues({...formValues, details: e.target.value})
                                }
                                disabled={!isEditMode}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        {editingProductId ? "닫기" : "취소"}
                    </Button>
                    {(currentUserInfo.role === "관리자" || currentUserInfo.role === "생산부") && (
                        <>
                            {editingProductId && !isEditMode ? (
                                <>
                                    <Button
                                        variant="danger"
                                        onClick={async () => {
                                            if (window.confirm("정말로 이 제품을 삭제하시겠습니까?")) {
                                                await submitDeleteProduct();
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
                                    onClick={editingProductId ? submitUpdateProduct : submitAddProduct}
                                >
                                    {editingProductId ? "적용" : "추가"}
                                </Button>
                            )}
                        </>
                    )}
                </Modal.Footer>
            </Modal>

            <Table striped bordered hover size="sm">
                <thead>
                <tr>
                    <th>제품명</th>
                    <th>규격</th>
                    <th>현재 수량</th>
                    <th>생산 중</th>
                    <th>출고 예정</th>
                    <th>실제 수량</th>
                </tr>
                </thead>
                <tbody>
                {productContentList.map((productContent) => (
                    <tr key={productContent.id} onClick={() => handleShowEdit(productContent)}>
                        <td>{productContent.name}</td>
                        <td>{productContent.spec}</td>
                        <td>{productContent.currentQuantity}</td>
                        <td>{productContent.inProductionQuantity}</td>
                        <td>{productContent.plannedOutboundQuantity}</td>
                        <td>{productContent.actualQuantity}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </>
    );
};

export default ProductContent;
