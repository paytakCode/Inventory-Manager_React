import React, {useEffect, useState} from "react";
import {addSupplier, deleteSupplier, getSupplierContentList, updateSupplier} from "services/materialService";
import Table from 'react-bootstrap/Table';
import {Form, Modal} from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import {SupplierDto} from "../../components/Base/SupplierDto";
import {SupplierContentDto} from "../../components/Content/SupplierContentDto";
import {getCurrentUserInfo} from "../../services/userService";
import styles from "pages/Content/CommonContent.module.scss";

const SupplierContent = () => {
    const currentUserInfo = getCurrentUserInfo();
    const [supplierContentList, setSupplierContentList] = useState<SupplierContentDto[]>([]);
    const [show, setShow] = useState(false);
    const [editingSupplierId, setEditingSupplierId] = useState<number | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [sortBy, setSortBy] = useState<string | undefined>(undefined);
    const [sortDirection, setSortDirection] = useState<string>("asc");
    const [searchKeyword, setSearchKeyword] = useState("");
    const [searchOption, setSearchOption] = useState("");
    const [validFields, setValidFields] = useState(true);
    const [inputTouched, setInputTouched] = useState({
        companyName: false,
        managerName: false,
        tel: false,
        loc: false
    });
    const initialValues = {
        companyName: "",
        managerName: "",
        tel: "",
        loc: ""
    } as SupplierDto;
    const [formValues, setFormValues] = useState<SupplierDto>(initialValues);
    let modalTitle;
    if (editingSupplierId) {
        modalTitle = isEditMode ? "공급처 수정" : "공급처 정보";
    } else {
        modalTitle = "공급처 추가";
    }

    const fetchSupplierContentList = async () => {
        try {
            const fetchedSupplierContentList = await getSupplierContentList();
            setSupplierContentList(fetchedSupplierContentList);
        } catch (error) {
            console.error("Failed to fetch supplier Content list:", error);
        }
    };

    useEffect(() => {

        const fetchData = async () => {
            try {
                await fetchSupplierContentList();
            } catch (error) {
                console.error("Failed to fetch Data:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        validateFields();
    }, [formValues, inputTouched]);


    const validateFields = () => {
        const {companyName, managerName, tel, loc} = formValues;

        setValidFields(
            companyName.trim() !== '' &&
            managerName.trim() !== '' &&
            loc.trim() !== '' &&
            /^(\d{3}-\d{4}-\d{4})$/.test(tel.trim())
        );
    };

    const sortSupplierContentList = (list: SupplierContentDto[]) => {
        const sortedList = [...list].sort((a, b) => {
            if (sortBy === "companyName") {
                return a.companyName.localeCompare(b.companyName);
            } else if (sortBy === "managerName") {
                return a.managerName.localeCompare(b.managerName);
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

    const submitAddSupplier = async () => {
        validateFields();
        if (validFields) {
            await addSupplier(formValues);
            setFormValues(initialValues);
            setShow(false);
            await fetchSupplierContentList();
        }
    };

    const submitUpdateSupplier = async () => {
        validateFields();
        if (editingSupplierId && validFields) {
            await updateSupplier(editingSupplierId, formValues);
            setFormValues(initialValues);
            setEditingSupplierId(null);
            setShow(false);
            await fetchSupplierContentList();
        }
    };

    const submitDeleteSupplier = async () => {
        if (editingSupplierId) {
            await deleteSupplier(editingSupplierId);
            setFormValues(initialValues);
            setEditingSupplierId(null);
            setShow(false);
            await fetchSupplierContentList();
        }
    };

    const handleClose = () => {
        setFormValues(initialValues);

        setEditingSupplierId(null);
        setShow(false);
    };

    const handleShowAdd = () => {
        setInputTouched({
            companyName: false,
            managerName: false,
            tel: false,
            loc: false
        });
        setFormValues(initialValues);
        setIsEditMode(true);
        setEditingSupplierId(null);
        setShow(true);
    };

    const handleShowEdit = (supplierContent: SupplierContentDto) => {
        setFormValues({
            id: supplierContent.id,
            companyName: supplierContent.companyName,
            managerName: supplierContent.managerName,
            tel: supplierContent.tel,
            loc: supplierContent.loc
        });

        setInputTouched({
            companyName: false,
            managerName: false,
            tel: false,
            loc: false
        });
        setIsEditMode(false);
        setEditingSupplierId(supplierContent.id);
        setShow(true);
    };

    return (
        <div className={styles.content}>
            <div className={styles.title}>자재 - 공급처 관리</div>
            <div className={styles.searchContainer}>
                <div className={styles.addButton}>
                    {(currentUserInfo.role === "관리자" || currentUserInfo.role === "자재부") && (
                        <Button variant="primary" onClick={handleShowAdd}>
                            +
                        </Button>
                    )}
                </div>
                <select value={searchOption} onChange={(e) => setSearchOption(e.target.value)}>
                    <option value="" disabled={true}>검색 옵션</option>
                    <option value="companyName">회사명</option>
                    <option value="managerName">담당자</option>
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
                        <Form.Group className="mb-3" controlId="companyName">
                            <Form.Label>회사명</Form.Label>
                            <Form.Control
                                type="text"
                                autoFocus
                                value={formValues.companyName}
                                onChange={(e) => {
                                    setFormValues({...formValues, companyName: e.target.value});
                                    setInputTouched({...inputTouched, companyName: true});
                                    validateFields();
                                }}
                                isInvalid={!validFields && inputTouched.companyName && formValues.companyName.trim() === ''}
                                disabled={!isEditMode}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                회사명을 입력해주세요.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="managerName">
                            <Form.Label>담당자</Form.Label>
                            <Form.Control
                                type="text"
                                value={formValues.managerName}
                                onChange={(e) => {
                                    setFormValues({...formValues, managerName: e.target.value});
                                    setInputTouched({...inputTouched, managerName: true});
                                    validateFields();
                                }}
                                isInvalid={!validFields && inputTouched.managerName && formValues.managerName.trim() === ''}
                                disabled={!isEditMode}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                담당자를 입력해주세요.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="tel">
                            <Form.Label>연락처</Form.Label>
                            <Form.Control
                                type="tel"
                                value={formValues.tel}
                                onChange={(e) => {
                                    setFormValues({...formValues, tel: e.target.value});
                                    setInputTouched({...inputTouched, tel: true});
                                    validateFields();
                                }}
                                isInvalid={!validFields && inputTouched.tel && (!/^(\d{3}-\d{4}-\d{4})$/.test(formValues.tel.trim()) || formValues.tel.trim() === '')}
                                disabled={!isEditMode}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                전화번호 형식에 맞춰 작성해주세요.
                                예) 010-1234-5678
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="loc">
                            <Form.Label>주소</Form.Label>
                            <Form.Control
                                type="text"
                                value={formValues.loc}
                                onChange={(e) => {
                                    setFormValues({...formValues, loc: e.target.value});
                                    setInputTouched({...inputTouched, loc: true});
                                    validateFields();
                                }}
                                isInvalid={!validFields && inputTouched.loc && formValues.loc.trim() === ''}
                                disabled={!isEditMode}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                주소를 입력해주세요.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        {editingSupplierId ? "닫기" : "취소"}
                    </Button>
                    {(currentUserInfo.role === "관리자" || currentUserInfo.role === "자재부") && (
                        <>
                            {editingSupplierId && !isEditMode ? (
                                <>
                                    <Button
                                        variant="danger"
                                        onClick={async () => {
                                            if (window.confirm("정말로 공급처를 삭제하시겠습니까?")) {
                                                await submitDeleteSupplier();
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
                                    onClick={editingSupplierId ? submitUpdateSupplier : submitAddSupplier}
                                >
                                    {editingSupplierId ? "적용" : "추가"}
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
                        <th style={{width: "20%"}} onClick={() => handleSort("companyName")}>
                            회사명 {sortBy === "companyName" && sortDirection === "asc" && <span>&uarr;</span>}
                            {sortBy === "companyName" && sortDirection === "desc" && <span>&darr;</span>}
                        </th>
                        <th style={{width: "20%"}} onClick={() => handleSort("managerName")}>
                            담당자 {sortBy === "managerName" && sortDirection === "asc" && <span>&uarr;</span>}
                            {sortBy === "managerName" && sortDirection === "desc" && <span>&darr;</span>}
                        </th>
                        <th style={{width: "20%"}}>연락처</th>
                        <th style={{width: "40%"}}>주소</th>
                    </tr>
                    </thead>
                    <tbody>
                    {sortSupplierContentList(supplierContentList)
                        .filter((supplierContent) => {
                            if (searchOption === "companyName") {
                                return supplierContent.companyName.toLowerCase().includes(searchKeyword.toLowerCase());
                            } else if (searchOption === "managerName") {
                                return supplierContent.managerName.toLowerCase().includes(searchKeyword.toLowerCase());
                            } else {
                                return true;
                            }
                        }).map((supplierContent) => (
                            <tr key={supplierContent.id} onClick={() => handleShowEdit(supplierContent)}>
                                <td>{supplierContent.companyName}</td>
                                <td>{supplierContent.managerName}</td>
                                <td>{supplierContent.tel}</td>
                                <td>{supplierContent.loc}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </div>
    );
};

export default SupplierContent;
;
