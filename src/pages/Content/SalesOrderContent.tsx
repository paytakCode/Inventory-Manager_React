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
import {SalesOrderContentDto} from "components/Content/SalesOrderContentDto";
import {getCurrentUserInfo, getUserList} from "services/userService";
import {UserInfoDto} from "components/Base/UserInfoDto";
import {getProductList} from "services/productService";
import OrderStatus from "../../components/Base/OrderStatus";
import {BuyerDto} from "../../components/Base/BuyerDto";
import {ProductDto} from "../../components/Base/ProductDto";
import {formatDate} from "../../utils/dateUtil";
import moment from "moment/moment";
import styles from "pages/Content/CommonContent.module.scss";

const SalesOrderContent = () => {
    const currentUserInfo = getCurrentUserInfo();
    const [salesOrderContentList, setSalesOrderContentList] = useState<SalesOrderContentDto[]>([]);
    const [userList, setUserList] = useState<UserInfoDto[]>([]);
    const [buyerList, setBuyerList] = useState<BuyerDto[]>([]);
    const [productList, setProductList] = useState<ProductDto[]>([]);
    const [show, setShow] = useState(false);
    const [editingSalesOrderId, setEditingSalesOrderId] = useState<number | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [sortBy, setSortBy] = useState<string | undefined>(undefined);
    const [sortDirection, setSortDirection] = useState<string>("asc");
    const [searchKeyword, setSearchKeyword] = useState("");
    const [searchOption, setSearchOption] = useState("");
    const [validFields, setValidFields] = useState(true);
    const [inputTouched, setInputTouched] = useState({
        buyerDto: false,
        managerDto: false,
        price: false,
        quantity: false,
        productDto: false,
        dueDate: false
    });
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
        quantity: 1,
        price: 0,
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

    useEffect(() => {
        validateFields();
    }, [formValues, inputTouched]);


    const validateFields = () => {
        const {
            buyerDto,
            managerDto,
            price,
            quantity,
            productDto,
            dueDate
        } = formValues;

        setValidFields(
            quantity >= 1 &&
            price >= 0 &&
            buyerDto?.id !== 0 &&
            managerDto?.id !== 0 &&
            productDto?.id !== 0 &&
            dueDate !== null
        );
    };

    const sortSalesOrderContentList = (list: SalesOrderContentDto[]) => {
        const sortedList = [...list].sort((a, b) => {
            if (sortBy === "name") {
                return a.productDto.name.localeCompare(b.productDto.name);
            } else if (sortBy === "companyName") {
                return a.buyerDto.companyName.localeCompare(b.buyerDto.companyName);
            } else if (sortBy === "manager") {
                return a.managerDto.name.localeCompare(b.managerDto.name);
            } else if (sortBy === "status") {
                return (a.status || "").localeCompare(b.status || "");
            } else if (sortBy === "regDate"
                || sortBy === "quantity"
                || sortBy === "completionDate"
                || sortBy === "dueDate") {
                const sortValueA = a[sortBy] || 0;
                const sortValueB = b[sortBy] || 0;
                if (sortValueA < sortValueB) return -1;
                if (sortValueA > sortValueB) return 1;
                return 0;
            } else {
                return 0;
            }
        });

        return sortDirection === "desc" ? sortedList.reverse() : sortedList;
    };


    const handleSort = (column: string) => {
        setSearchKeyword("");
        if (column === sortBy) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortBy(column);
            setSortDirection("asc");
        }
    };


    const submitAddSalesOrder = async () => {
        validateFields();
        if (validFields) {
            await addSalesOrder(formValues);
            setFormValues(initialValues);
            setShow(false);
            await fetchSalesOrderContentList();
        } else {
            setInputTouched({
                buyerDto: true,
                managerDto: true,
                price: true,
                quantity: true,
                productDto: true,
                dueDate: true
            });
        }
    };

    const submitUpdateSalesOrder = async () => {
        validateFields();
        if (editingSalesOrderId && validFields) {
            await updateSalesOrder(editingSalesOrderId, formValues);
            setFormValues(initialValues);
            setEditingSalesOrderId(null);
            setShow(false);
            await fetchSalesOrderContentList();
        } else {
            setInputTouched({
                buyerDto: true,
                managerDto: true,
                price: true,
                quantity: true,
                productDto: true,
                dueDate: true
            });
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
        setInputTouched({
            buyerDto: false,
            managerDto: false,
            price: false,
            quantity: false,
            productDto: false,
            dueDate: false
        });
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
            price: salesOrderContent.price,
            regDate: salesOrderContent.regDate,
            managerDto: salesOrderContent.managerDto,
            buyerDto: salesOrderContent.buyerDto,
            dueDate: salesOrderContent.dueDate,
            completionDate: salesOrderContent.completionDate,
            status: salesOrderContent.status
        });

        setInputTouched({
            buyerDto: false,
            managerDto: false,
            price: false,
            quantity: false,
            productDto: false,
            dueDate: false
        });
        setIsEditMode(false);
        setEditingSalesOrderId(salesOrderContent.id);
        setShow(true);
    };

    return (
        <div className={styles.content}>
            <div className={styles.title}>영업 - 발주 목록</div>
            <div className={styles.searchContainer}>
                <div className={styles.addButton}>
                    {(currentUserInfo.role === "관리자" || currentUserInfo.role === "영업부") && (
                        <Button variant="primary" onClick={handleShowAdd}>
                            +
                        </Button>
                    )}
                </div>
                <select value={searchOption} onChange={(e) => setSearchOption(e.target.value)}>
                    <option value="" disabled={true}>검색 옵션</option>
                    <option value="name">제품명</option>
                    <option value="companyName">구매처</option>
                    <option value="manager">담당자</option>
                </select>
                <input
                    type="text"
                    value={searchKeyword}
                    placeholder="검색어를 입력하세요"
                    onChange={(e) => setSearchKeyword(e.target.value)}
                />
                <button onClick={() => {
                    setSearchKeyword("");
                }}>
                    초기화
                </button>
            </div>

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
                                value={formValues.productDto.id || 0}
                                onChange={(e) => {
                                    setFormValues({
                                        ...formValues,
                                        productDto: {
                                            ...formValues.productDto,
                                            id: parseInt(e.target.value),
                                        },
                                    });
                                    setInputTouched({...inputTouched, productDto: true});
                                    validateFields();
                                }}
                                isInvalid={!validFields && inputTouched.productDto && formValues.productDto?.id === 0}
                                disabled={!isEditMode}
                                required
                            >
                                <option value="">제품을 선택해주세요</option>
                                {productList.map((product) => (
                                    <option key={product.id} value={product.id || 0}>
                                        {product.name} - {product.spec}
                                    </option>
                                ))}
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                                제품을 선택해주세요.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="quantity">
                            <Form.Label>수량</Form.Label>
                            <Form.Control
                                type="number"
                                value={formValues.quantity}
                                onChange={(e) => {
                                    setFormValues({...formValues, quantity: parseInt(e.target.value)});
                                    setInputTouched({...inputTouched, quantity: true});
                                    validateFields();
                                }}
                                isInvalid={!validFields && inputTouched.quantity && formValues.quantity < 1}
                                disabled={!isEditMode}
                            />
                            <Form.Control.Feedback type="invalid">
                                1개 이상의 수량을 입력하세요.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="price">
                            <Form.Label>총 판매가</Form.Label>
                            <Form.Control
                                type="number"
                                value={formValues.price}
                                onChange={(e) => {
                                    setFormValues({...formValues, price: parseInt(e.target.value)});
                                    setInputTouched({...inputTouched, price: true});
                                    validateFields();
                                }}
                                isInvalid={!validFields && inputTouched.price && formValues.price >= 0}
                                disabled={!isEditMode}
                            />
                            <Form.Control.Feedback type="invalid">
                                0원 이상의 금액을 입력하세요.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="buyer">
                            <Form.Label>구매처</Form.Label>
                            <Form.Control
                                as="select"
                                value={formValues.buyerDto.id || 0}
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
                                <option value="0">구매처를 선택해주세요</option>
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
                                onChange={(e) => {
                                    setFormValues({
                                        ...formValues,
                                        managerDto: {
                                            ...formValues.managerDto,
                                            id: parseInt(e.target.value),
                                        },
                                    });
                                    setInputTouched({...inputTouched, managerDto: true});
                                    validateFields();
                                }}
                                isInvalid={!validFields && inputTouched.managerDto && formValues.managerDto?.id === 0}
                                disabled={!isEditMode}
                            >
                                <option
                                    value={currentUserInfo.id}>{currentUserInfo.name} - {currentUserInfo.email}</option>
                                {userList.map((user) => (currentUserInfo.id !== user.id) && (
                                    <option key={user.id} value={user.id}>
                                        {user.name} - {user.email}
                                    </option>
                                ))}
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                                담당자를 선택해주세요.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="regDate">
                            <Form.Label>등록 날짜</Form.Label>
                            <Form.Control
                                type="date"
                                value={formValues.regDate ? moment(formValues.regDate).format('YYYY-MM-DD') : ''}
                                onChange={(e) =>
                                    setFormValues({...formValues, regDate: new Date(e.target.value)})
                                }
                                disabled={true}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="completionDate">
                            <Form.Label>완료 날짜</Form.Label>
                            <Form.Control
                                type="date"
                                value={formValues.completionDate ? moment(formValues.completionDate).format('YYYY-MM-DD') : ''}
                                onChange={(e) =>
                                    setFormValues({...formValues, completionDate: new Date(e.target.value)})
                                }
                                disabled={!isEditMode}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="dueDate">
                            <Form.Label>기한</Form.Label>
                            <Form.Control
                                type="date"
                                value={formValues.dueDate ? moment(formValues.dueDate).format('YYYY-MM-DD') : ''}
                                onChange={(e) => {
                                    setFormValues({...formValues, dueDate: new Date(e.target.value)});
                                    setInputTouched({...inputTouched, dueDate: true});
                                    validateFields();
                                }}
                                isInvalid={!validFields && inputTouched.dueDate && formValues.dueDate !== null}
                                disabled={!isEditMode}
                            />
                        </Form.Group>
                        <Form.Control.Feedback type="invalid">
                            기한을 선택해주세요.
                        </Form.Control.Feedback>
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
            <div className={styles.tableContainer}>
                <Table striped bordered hover size="sm">
                    <thead>
                    <tr>
                        <th onClick={() => handleSort("name")}>
                            제품명 {sortBy === "name" && sortDirection === "asc" && <span>&uarr;</span>}
                            {sortBy === "name" && sortDirection === "desc" && <span>&darr;</span>}
                        </th>
                        <th onClick={() => handleSort("quantity")}>
                            판매 수량 {sortBy === "quantity" && sortDirection === "asc" && <span>&uarr;</span>}
                            {sortBy === "quantity" && sortDirection === "desc" && <span>&darr;</span>}
                        </th>
                        <th onClick={() => handleSort("companyName")}>
                            구매처 {sortBy === "companyName" && sortDirection === "asc" && <span>&uarr;</span>}
                            {sortBy === "companyName" && sortDirection === "desc" && <span>&darr;</span>}
                        </th>
                        <th onClick={() => handleSort("manager")}>
                            담당자 {sortBy === "manager" && sortDirection === "asc" && <span>&uarr;</span>}
                            {sortBy === "manager" && sortDirection === "desc" && <span>&darr;</span>}
                        </th>
                        <th onClick={() => handleSort("status")}>
                            진행 상태 {sortBy === "status" && sortDirection === "asc" && <span>&uarr;</span>}
                            {sortBy === "status" && sortDirection === "desc" && <span>&darr;</span>}
                        </th>
                        <th onClick={() => handleSort("regDate")}>
                            등록 날짜 {sortBy === "regDate" && sortDirection === "asc" && <span>&uarr;</span>}
                            {sortBy === "regDate" && sortDirection === "desc" && <span>&darr;</span>}
                        </th>
                        <th onClick={() => handleSort("completionDate")}>
                            완료 날짜 {sortBy === "completionDate" && sortDirection === "asc" && <span>&uarr;</span>}
                            {sortBy === "completionDate" && sortDirection === "desc" && <span>&darr;</span>}
                        </th>
                        <th onClick={() => handleSort("dueDate")}>
                            기한 {sortBy === "dueDate" && sortDirection === "asc" && <span>&uarr;</span>}
                            {sortBy === "dueDate" && sortDirection === "desc" && <span>&darr;</span>}
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {sortSalesOrderContentList(salesOrderContentList)
                        .filter((salesOrderContent) => {
                            if (searchOption === "name") {
                                return salesOrderContent.productDto.name.toLowerCase().includes(searchKeyword.toLowerCase());
                            } else if (searchOption === "companyName") {
                                return salesOrderContent.buyerDto.companyName.toLowerCase().includes(searchKeyword.toLowerCase());
                            } else if (searchOption === "manager") {
                                return salesOrderContent.managerDto.name.toLowerCase().includes(searchKeyword.toLowerCase());
                            } else {
                                return true;
                            }
                        }).map((salesOrderContent) => (
                            <tr key={salesOrderContent.id} onClick={() => handleShowEdit(salesOrderContent)}>
                                <td>{salesOrderContent.productDto.name}</td>
                                <td>{salesOrderContent.quantity}</td>
                                <td>{salesOrderContent.buyerDto.companyName}</td>
                                <td>{salesOrderContent.managerDto.name}</td>
                                <td>{salesOrderContent.status}</td>
                                <td>{formatDate(salesOrderContent.regDate || new Date(""))}</td>
                                <td>{formatDate(salesOrderContent.completionDate || new Date(""))}</td>
                                <td>{formatDate(salesOrderContent.dueDate)}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </div>
    );
};

export default SalesOrderContent;
