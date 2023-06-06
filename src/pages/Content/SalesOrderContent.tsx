import React, {useEffect, useState} from "react";
import {
    addSalesOrder,
    deleteSalesOrder,
    getBuyerList,
    getSalesOrderContentList,
    updateSalesOrder
} from "services/salesService";
import Table from 'react-bootstrap/Table';
import {Form, Modal} from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import {SalesOrderDto} from "components/Base/SalesOrderDto";
import {SalesOrderContentDto} from "components/SalesOrderContentDto";
import {getCurrentUserInfo, getUserList} from "services/userService";
import {UserInfoDto} from "components/Base/UserInfoDto";
import {getProductList} from "services/productService";
import OrderStatus from "../../components/Base/OrderStatus";
import moment from "moment";
import {BuyerDto} from "../../components/Base/BuyerDto";
import {ProductDto} from "../../components/Base/ProductDto";

const SalesOrderContent = () => {
    const currentUserInfo = getCurrentUserInfo();
    const [salesOrderContentList, setSalesOrderContentList] = useState<SalesOrderContentDto[]>([]);
    const [userList, setUserList] = useState<UserInfoDto[]>([]);
    const [buyerList, setBuyerList] = useState<BuyerDto[]>([]);
    const [productList, setProductList] = useState<ProductDto[]>([]);
    const [show, setShow] = useState(false);
    const [editingSalesOrderId, setEditingSalesOrderId] = useState<number | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const initialValues = {
        buyerDto: {
            companyName: "",
            managerName: "",
            tel: "",
            loc: ""
        },
        managerDto: {
            id: 0,
            email: "",
            name: "",
            tel: "",
            role: ""
        },
        productDto: {
            name: ""
        },
        quantity: 0,
        dueDate: new Date()
    } as SalesOrderDto;
    const [formValues, setFormValues] = useState<SalesOrderDto>(initialValues);
    let modalTitle;

    if (editingSalesOrderId) {
        modalTitle = isEditMode ? "발주 수정" : "발주 정보";
    } else {
        modalTitle = "발주 추가";
    }
    
    const fetchSalesOrderContentList = async () => {
        try {
            const fetchedSalesOrderContentList = await getSalesOrderContentList();
            setSalesOrderContentList(fetchedSalesOrderContentList);
        } catch (error) {
            console.error("Failed to fetch salesOrder Content list:", error);
        }
    };

    useEffect(() => {

        const fetchData = async () => {
            try {
                await fetchSalesOrderContentList();

                const fetchedUserList = await getUserList();
                setUserList(fetchedUserList);

                const fetchedBuyerList = await getBuyerList();
                setBuyerList(fetchedBuyerList);

                const fetchedProductList = await getProductList();
                setProductList(fetchedProductList);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };

        fetchData();
    }, []);


    const submitAddSalesOrder = async () => {
        await addSalesOrder(formValues);
        setFormValues(initialValues);
        setShow(false);
        await fetchSalesOrderContentList();
    };

    const submitUpdateSalesOrder = async () => {
        if (editingSalesOrderId) {
            await updateSalesOrder(editingSalesOrderId, formValues);
            setFormValues(initialValues);
            setEditingSalesOrderId(null);
            setShow(false);
            await fetchSalesOrderContentList();
        }
    };

    const submitDeleteSalesOrder = async () => {
        if (editingSalesOrderId) {
            await deleteSalesOrder(editingSalesOrderId);
            setFormValues(initialValues);
            setEditingSalesOrderId(null);
            setShow(false);
            await fetchSalesOrderContentList();
        }
    };

    const handleClose = () => {
        setFormValues(initialValues);

        setEditingSalesOrderId(null);
        setShow(false);
    };

    const handleShowAdd = () => {
        setFormValues(initialValues);
        setIsEditMode(true);
        setEditingSalesOrderId(null);
        setShow(true);
    };

    const handleShowEdit = (salesOrderContent: SalesOrderContentDto) => {
        setFormValues({
            id: salesOrderContent.id,
            productDto: salesOrderContent.productDto,
            quantity: salesOrderContent.quantity,
            managerDto: salesOrderContent.managerDto,
            buyerDto: salesOrderContent.buyerDto,
            dueDate: salesOrderContent.dueDate,
            completionDate: salesOrderContent.completionDate,
            status: salesOrderContent.status
        });

        setIsEditMode(false);
        setEditingSalesOrderId(salesOrderContent.id);
        setShow(true);
    };

    return (
        <>
            <div>SalesOrder</div>
            {(currentUserInfo.role === "관리자" || currentUserInfo.role === "영업부") && (
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
                        <Form.Group className="mb-3" controlId="material">
                            <Form.Label>제품명</Form.Label>
                            <Form.Control
                                as="select"
                                value={formValues.productDto.id || ""}
                                onChange={(e) =>
                                    setFormValues({
                                        ...formValues,
                                        productDto: {
                                            id: parseInt(e.target.value),
                                            name: "",
                                            spec: "",
                                            details: ""
                                        }
                                    })
                                }
                                disabled={!isEditMode}
                            >
                                <option value="">제품을 선택해주세요</option>
                                {productList.map((product) => (
                                    <option key={product.id} value={product.id || 0}>
                                        {product.name} - {product.spec}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="quantity">
                            <Form.Label>수량</Form.Label>
                            <Form.Control
                                type="number"
                                value={formValues.quantity}
                                onChange={(e) =>
                                    setFormValues({ ...formValues, quantity: parseInt(e.target.value) })
                                }
                                disabled={!isEditMode}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="buyer">
                            <Form.Label>구매처</Form.Label>
                            <Form.Control
                                as="select"
                                value={formValues.buyerDto.id || ""}
                                onChange={(e) =>
                                    setFormValues({
                                        ...formValues,
                                        buyerDto: {
                                            id: parseInt(e.target.value),
                                            companyName: "",
                                            managerName: "",
                                            tel: "",
                                            loc: ""
                                        }
                                    })
                                }
                                disabled={!isEditMode}
                            >
                                <option value="">구매처를 선택해주세요</option>
                                {buyerList.map((buyer) => (
                                    <option key={buyer.id} value={buyer.id || 0}>
                                        {buyer.companyName} - {buyer.managerName}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="manager">
                            <Form.Label>담당자</Form.Label>
                            <Form.Control
                                as="select"
                                value={formValues.managerDto.id}
                                onChange={(e) =>
                                    setFormValues({
                                        ...formValues,
                                        managerDto: {
                                            ...formValues.managerDto,
                                            id: parseInt(e.target.value)
                                        }
                                    })
                                }
                                disabled={!isEditMode}
                            >
                                <option value={currentUserInfo.id}>
                                    {currentUserInfo.name} - {currentUserInfo.email}
                                </option>
                                {userList.map(
                                    (user) =>
                                        currentUserInfo.id !== user.id && (
                                            <option key={user.id} value={user.id}>
                                                {user.name} - {user.email}
                                            </option>
                                        )
                                )}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="status">
                            <Form.Label>진행 상태</Form.Label>
                            <Form.Control
                                as="select"
                                value={formValues.status || OrderStatus.ORDER_CONFIRMED}
                                onChange={(e) =>
                                    setFormValues({
                                        ...formValues,
                                        status: e.target.value as OrderStatus
                                    })
                                }
                                disabled={!isEditMode}
                            >
                                {Object.values(OrderStatus).map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        {editingSalesOrderId ? "닫기" : "취소"}
                    </Button>
                    {(currentUserInfo.role === "관리자" || currentUserInfo.role === "영업부") && (
                        <>
                            {editingSalesOrderId && !isEditMode ? (
                                <>
                                    <Button
                                        variant="danger"
                                        onClick={async () => {
                                            if (window.confirm("정말로 발주를 삭제하시겠습니까?")) {
                                                await submitDeleteSalesOrder();
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
                                    onClick={editingSalesOrderId ? submitUpdateSalesOrder : submitAddSalesOrder}
                                >
                                    {editingSalesOrderId ? "적용" : "추가"}
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
                    <th>수량</th>
                    <th>구매처</th>
                    <th>담당자</th>
                    <th>발주날짜</th>
                    <th>진행상태</th>
                </tr>
                </thead>
                <tbody>
                {salesOrderContentList.map((salesOrderContent) => (
                    <tr key={salesOrderContent.id} onClick={() => handleShowEdit(salesOrderContent)}>
                        <td>{salesOrderContent.productDto.name}</td>
                        <td>{salesOrderContent.quantity}</td>
                        <td>{salesOrderContent.buyerDto.companyName}</td>
                        <td>{salesOrderContent.managerDto.name}</td>
                        <td>{moment(salesOrderContent.dueDate).format('YYYY-MM-DD' )}</td>
                        <td>{salesOrderContent.status}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </>
    );
};

export default SalesOrderContent;
