import React, {useEffect, useState} from "react";
import {addProduct, deleteProduct, getProductContentList, updateProduct} from "services/productService";
import Table from 'react-bootstrap/Table';
import {Form, Modal} from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import type {ProductContentDto} from "components/Content/ProductContentDto";
import {getCurrentUserInfo} from "../../services/userService";
import {ProductDto} from "../../components/Base/ProductDto";
import styles from "pages/Content/CommonContent.module.scss";

const ProductContent = () => {
    const currentUserInfo = getCurrentUserInfo();
    const [productContentList, setProductContentList] = useState<ProductContentDto[]>([]);
    const [show, setShow] = useState(false);
    const [editingProductId, setEditingProductId] = useState<number | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [sortBy, setSortBy] = useState<string | undefined>(undefined);
    const [sortDirection, setSortDirection] = useState<string>("asc");
    const [searchKeyword, setSearchKeyword] = useState("");
    const [searchOption, setSearchOption] = useState("");
    const [validFields, setValidFields] = useState(true);
    const [inputTouched, setInputTouched] = useState({
        name: false,
        spec: false
    });
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

    useEffect(() => {
        validateFields();
    }, [formValues, inputTouched]);


    const validateFields = () => {
        const {name, spec} = formValues;

        setValidFields(
            name.trim() !== '' &&
            spec?.trim() !== ''
        );
    };

    const sortProductContentList = (list: ProductContentDto[]) => {
        const sortedList = [...list].sort((a, b) => {
            if (sortBy === "name") {
                return a.name.localeCompare(b.name);
            } else if (sortBy === "spec") {
                return (a.spec || "").localeCompare(b.spec || "");
            } else if (sortBy === "currentQuantity"
                || sortBy === "inProductionQuantity"
                || sortBy === "plannedOutboundQuantity"
                || sortBy === "actualQuantity") {
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

    const submitAddProduct = async () => {
        validateFields();
        if (validFields) {
            await addProduct(formValues);
            setFormValues(initialValues);
            setShow(false);
            await fetchProductContentList();
        } else {
            setInputTouched({
                name: true,
                spec: true
            });
        }
    };

    const submitUpdateProduct = async () => {
        if (editingProductId && validFields) {
            await updateProduct(editingProductId, formValues);
            setFormValues(initialValues);
            setEditingProductId(null);
            setShow(false);
            await fetchProductContentList();
        } else {
            setInputTouched({
                name: true,
                spec: true
            });
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
        setInputTouched({
            name: false,
            spec: false
        });
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

        setInputTouched({
            name: false,
            spec: false
        });
        setIsEditMode(false);
        setEditingProductId(productContent.id);
        setShow(true);
    };

    return (
        <div className={styles.content}>
            <div className={styles.title}>제품 - 제품 목록</div>
            <div className={styles.searchContainer}>
                <div className={styles.addButton}>
                    {(currentUserInfo.role === "관리자" || currentUserInfo.role === "생산부") && (
                        <Button variant="primary" onClick={handleShowAdd}>
                            추가
                        </Button>
                    )}
                </div>
                <select value={searchOption} onChange={(e) => setSearchOption(e.target.value)}>
                    <option value="" disabled={true}>검색 옵션</option>
                    <option value="name">제품명</option>
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
                        <Form.Group className="mb-3" controlId="name">
                            <Form.Label>제품명</Form.Label>
                            <Form.Control
                                type="text"
                                autoFocus
                                value={formValues.name}
                                onChange={(e) => {
                                    setFormValues({...formValues, name: e.target.value});
                                    setInputTouched({...inputTouched, name: true});
                                    validateFields();
                                }}
                                isInvalid={!validFields && inputTouched.name && formValues.name.trim() === ''}
                                required
                                disabled={!isEditMode}
                            />
                            <Form.Control.Feedback type="invalid">
                                제품명을 입력해주세요.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="spec">
                            <Form.Label>규격</Form.Label>
                            <Form.Control
                                type="text"
                                value={formValues.spec || ""}
                                onChange={(e) => {
                                    setFormValues({...formValues, spec: e.target.value});
                                    setInputTouched({...inputTouched, spec: true});
                                    validateFields();
                                }}
                                isInvalid={!validFields && inputTouched.spec && formValues.spec?.trim() === ''}
                                disabled={!isEditMode}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                규격을 입력해주세요.
                            </Form.Control.Feedback>
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
            <div className={styles.tableContainer}>
                <Table striped bordered hover size="sm">
                    <thead>
                    <tr>
                        <th onClick={() => handleSort("name")}>
                            제품명 {sortBy === "name" && sortDirection === "asc" && <span>&uarr;</span>}
                            {sortBy === "name" && sortDirection === "desc" && <span>&darr;</span>}
                        </th>
                        <th onClick={() => handleSort("spec")}>
                            규격 {sortBy === "spec" && sortDirection === "asc" && <span>&uarr;</span>}
                            {sortBy === "spec" && sortDirection === "desc" && <span>&darr;</span>}
                        </th>
                        <th onClick={() => handleSort("currentQuantity")}>
                            현재 수량 {sortBy === "currentQuantity" && sortDirection === "asc" && <span>&uarr;</span>}
                            {sortBy === "currentQuantity" && sortDirection === "desc" && <span>&darr;</span>}
                        </th>
                        <th onClick={() => handleSort("inProductionQuantity")}>
                            생산 중 {sortBy === "inProductionQuantity" && sortDirection === "asc" && <span>&uarr;</span>}
                            {sortBy === "inProductionQuantity" && sortDirection === "desc" && <span>&darr;</span>}
                        </th>
                        <th onClick={() => handleSort("plannedOutboundQuantity")}>
                            출고 예정 {sortBy === "plannedOutboundQuantity" && sortDirection === "asc" &&
                            <span>&uarr;</span>}
                            {sortBy === "plannedOutboundQuantity" && sortDirection === "desc" && <span>&darr;</span>}
                        </th>
                        <th onClick={() => handleSort("actualQuantity")}>
                            실제 수량 {sortBy === "actualQuantity" && sortDirection === "asc" && <span>&uarr;</span>}
                            {sortBy === "actualQuantity" && sortDirection === "desc" && <span>&darr;</span>}
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {sortProductContentList(productContentList)
                        .filter((productContent) => {
                            if (searchOption === "name") {
                                return productContent.name.toLowerCase().includes(searchKeyword.toLowerCase());
                            } else {
                                return true;
                            }
                        }).map((productContent) => (
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
            </div>
        </div>
    );
};

export default ProductContent;
