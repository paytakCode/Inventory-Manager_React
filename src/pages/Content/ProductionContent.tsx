import React, {useEffect, useState} from "react";
import {
    addProduction,
    deleteProduction,
    getProductionContentList,
    getProductList,
    updateProduction
} from "services/productService";
import Table from 'react-bootstrap/Table';
import {Form, Modal} from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import type {ProductionContentDto} from "components/ProductionContentDto";
import {getCurrentUserInfo, getUserList} from "services/userService";
import {ProductionDto} from "components/Base/ProductionDto";
import {UserInfoDto} from "components/Base/UserInfoDto";
import {ProductDto} from "components/Base/ProductDto";
import ProductionStatus from "components/Base/ProductionStatus";
import moment from "moment";
import {formatDate} from "../../utils/dateUtil";

const ProductionContent = () => {
    const currentUserInfo = getCurrentUserInfo();
    const [productionContentList, setProductionContentList] = useState<ProductionContentDto[]>([]);
    const [userList, setUserList] = useState<UserInfoDto[]>([]);
    const [productList, setProductList] = useState<ProductDto[]>([]);
    const [show, setShow] = useState(false);
    const [editingProductionId, setEditingProductionId] = useState<number | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [sortBy, setSortBy] = useState<string | undefined>(undefined);
    const [sortDirection, setSortDirection] = useState<string>("asc");
    const [searchKeyword, setSearchKeyword] = useState("");
    const [searchOption, setSearchOption] = useState("");
    const initialValues = {
        productDto: {
            name: "",
            details: ""
        },
        managerDto: currentUserInfo,
        quantity: 0,
        targetDate: new Date()
    } as ProductionDto;
    const [formValues, setFormValues] = useState<ProductionDto>(initialValues);
    let modalTitle;
    if (editingProductionId) {
        modalTitle = isEditMode ? "생산 정보 수정" : "생산 정보";
    } else {
        modalTitle = "생산 계획 추가";
    }

    const fetchProductionContentList = async () => {
        try {
            const fetchedProductionContentList = await getProductionContentList();
            setProductionContentList(fetchedProductionContentList);
        } catch (error) {
            console.error("Failed to fetch production list:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchProductionContentList();

                const fetchedUserList = await getUserList();
                setUserList(fetchedUserList);

                const fetchedProductList = await getProductList();
                setProductList(fetchedProductList);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };

        fetchData();
    }, []);

    const sortProductionContentList = (list: ProductionContentDto[]) => {
        const sortedList = [...list].sort((a, b) => {
            if (sortBy === "name") {
                return a.productDto.name.localeCompare(b.productDto.name);
            } else if (sortBy === "manager") {
                return (a.managerDto.name).localeCompare(b.managerDto.name);
            } else if (sortBy === "status") {
                return (a.status || "").localeCompare(b.status || "");
            } else if (sortBy === "quantity"
                || sortBy === "targetDate"
                || sortBy === "completionDate") {
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


    const submitAddProduction = async () => {
        await addProduction(formValues);
        setFormValues(initialValues);
        setShow(false);
        await fetchProductionContentList();
    };

    const submitUpdateProduction = async () => {
        if (editingProductionId) {
            await updateProduction(editingProductionId, formValues);
            setFormValues(initialValues);
            setEditingProductionId(null);
            setShow(false);
            await fetchProductionContentList();
        }
    };

    const submitDeleteProduction = async () => {
        if (editingProductionId) {
            await deleteProduction(editingProductionId);
            setFormValues(initialValues);
            setEditingProductionId(null);
            setShow(false);
            await fetchProductionContentList();
        }
    };

    const handleClose = () => {
        setFormValues(initialValues);

        setEditingProductionId(null);
        setShow(false);
    };

    const handleShowAdd = () => {
        setFormValues(initialValues);
        setIsEditMode(true);
        setEditingProductionId(null);
        setShow(true);
    };

    const handleShowEdit = (productionContent: ProductionContentDto) => {
        setFormValues({
            id: productionContent.id,
            productDto: productionContent.productDto,
            targetDate: productionContent.targetDate,
            quantity: productionContent.quantity,
            managerDto: productionContent.managerDto,
            status: productionContent.status,
            lotNo: productionContent.lotNo,
            details: productionContent.details,
            completionDate: productionContent.completionDate
        });

        setIsEditMode(false);
        setEditingProductionId(productionContent.id);
        setShow(true);
    };

    return (
        <>
            <div>ProductionContent</div>
            <div>
                <select value={searchOption} onChange={(e) => setSearchOption(e.target.value)}>
                    <option value="" disabled={true}>검색 옵션</option>
                    <option value="name">제품명</option>
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
                                as="select"
                                value={formValues.productDto?.id || 0}
                                onChange={(e) =>
                                    setFormValues({
                                        ...formValues,
                                        productDto: {
                                            ...formValues.productDto,
                                            id: parseInt(e.target.value),
                                        },
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
                                    setFormValues({...formValues, quantity: parseInt(e.target.value)})
                                }
                                disabled={!isEditMode}
                            />
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
                                            id: parseInt(e.target.value),
                                        },
                                    })
                                }
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
                        <Form.Group className="mb-3" controlId="targetDate">
                            <Form.Label>목표일</Form.Label>
                            <Form.Control
                                type="date"
                                value={formValues.targetDate ? moment(formValues.targetDate).format('YYYY-MM-DD') : ''}
                                onChange={(e) =>
                                    setFormValues({...formValues, targetDate: new Date(e.target.value)})
                                }
                                disabled={!isEditMode}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="completionDate">
                            <Form.Label>완료일</Form.Label>
                            <Form.Control
                                type="date"
                                value={formValues.completionDate ? moment(formValues.completionDate).format('YYYY-MM-DD') : ''}
                                onChange={(e) =>
                                    setFormValues({...formValues, completionDate: new Date(e.target.value)})
                                }
                                disabled={!isEditMode}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="lotNo">
                            <Form.Label>LotNo</Form.Label>
                            <Form.Control
                                type="text"
                                value={formValues.lotNo || ""}
                                onChange={(e) =>
                                    setFormValues({...formValues, lotNo: e.target.value})
                                }
                                disabled={!isEditMode}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="status">
                            <Form.Label>진행 상태</Form.Label>
                            <Form.Control
                                as="select"
                                value={formValues.status || ProductionStatus.PLANNED}
                                onChange={(e) =>
                                    setFormValues({
                                        ...formValues,
                                        status: e.target.value as ProductionStatus
                                    })
                                }
                                disabled={!isEditMode}
                            >
                                {Object.values(ProductionStatus).map((status) => (
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
                        {editingProductionId ? "닫기" : "취소"}
                    </Button>
                    {(currentUserInfo.role === "관리자" || currentUserInfo.role === "생산부") && (
                        <>
                            {editingProductionId && !isEditMode ? (
                                <>
                                    <Button
                                        variant="danger"
                                        onClick={async () => {
                                            if (window.confirm("정말로 이 제품을 삭제하시겠습니까?")) {
                                                await submitDeleteProduction();
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
                                    onClick={editingProductionId ? submitUpdateProduction : submitAddProduction}
                                >
                                    {editingProductionId ? "적용" : "추가"}
                                </Button>
                            )}
                        </>
                    )}
                </Modal.Footer>
            </Modal>

            <Table striped bordered hover size="sm">
                <thead>
                <tr>
                    <th onClick={() => handleSort("name")}>
                        제품명 {sortBy === "name" && sortDirection === "asc" && <span>&uarr;</span>}
                        {sortBy === "name" && sortDirection === "desc" && <span>&darr;</span>}
                    </th>
                    <th onClick={() => handleSort("quantity")}>
                        생산 수량 {sortBy === "quantity" && sortDirection === "asc" && <span>&uarr;</span>}
                        {sortBy === "quantity" && sortDirection === "desc" && <span>&darr;</span>}
                    </th>
                    <th onClick={() => handleSort("manager")}>
                        담당자 {sortBy === "manager" && sortDirection === "asc" && <span>&uarr;</span>}
                        {sortBy === "manager" && sortDirection === "desc" && <span>&darr;</span>}
                    </th>
                    <th onClick={() => handleSort("targetDate")}>
                        생산 목표일 {sortBy === "targetDate" && sortDirection === "asc" && <span>&uarr;</span>}
                        {sortBy === "targetDate" && sortDirection === "desc" && <span>&darr;</span>}
                    </th>
                    <th onClick={() => handleSort("completionDate")}>
                        생산 완료일 {sortBy === "completionDate" && sortDirection === "asc" && <span>&uarr;</span>}
                        {sortBy === "completionDate" && sortDirection === "desc" && <span>&darr;</span>}
                    </th>
                    <th onClick={() => handleSort("status")}>
                        진행 상태 {sortBy === "status" && sortDirection === "asc" && <span>&uarr;</span>}
                        {sortBy === "status" && sortDirection === "desc" && <span>&darr;</span>}
                    </th>
                </tr>
                </thead>
                <tbody>
                {sortProductionContentList(productionContentList)
                    .filter((productionContent) => {
                        if (searchOption === "name") {
                            return productionContent.productDto.name.toLowerCase().includes(searchKeyword.toLowerCase());
                        } else if (searchOption === "manager") {
                            return productionContent.managerDto.name.toLowerCase().includes(searchKeyword.toLowerCase());
                        } else {
                            return true;
                        }
                    }).map((productionContent) => (
                        <tr key={productionContent.id} onClick={() => handleShowEdit(productionContent)}>
                            <td>{productionContent.productDto.name}</td>
                            <td>{productionContent.quantity}</td>
                            <td>{productionContent.managerDto.name}</td>
                            <td>{formatDate(productionContent.targetDate)}</td>
                            <td>{formatDate(productionContent.completionDate || new Date(''))}</td>
                            <td>{productionContent.status}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    );
};

export default ProductionContent;
