import React, {useEffect, useState} from "react";
import {
    addMaterial,
    deleteMaterial,
    getMaterialContentList,
    getSupplierList,
    updateMaterial
} from "services/materialService";
import Table from 'react-bootstrap/Table';
import {Form, Modal} from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import type {MaterialContentDto} from "components/Content/MaterialContentDto";
import {SupplierDto} from "../../components/Base/SupplierDto";
import {getCurrentUserInfo} from "../../services/userService";
import {MaterialDto} from "../../components/Base/MaterialDto";
import styles from "pages/Content/CommonContent.module.scss";

const MaterialContent = () => {
    const currentUserInfo = getCurrentUserInfo();
    const [materialContentList, setMaterialContentList] = useState<MaterialContentDto[]>([]);
    const [supplierList, setSupplierList] = useState<SupplierDto[]>([]);
    const [show, setShow] = useState(false);
    const [editingMaterialId, setEditingMaterialId] = useState<number | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [sortBy, setSortBy] = useState<string | undefined>(undefined);
    const [sortDirection, setSortDirection] = useState<string>("asc");
    const [searchKeyword, setSearchKeyword] = useState("");
    const [searchOption, setSearchOption] = useState("");
    const [validFields, setValidFields] = useState(true);
    const [inputTouched, setInputTouched] = useState({
        name: false,
        spec: false,
        supplierDto: false
    });

    const initialValues = {
        name: "",
        spec: ""
    } as MaterialDto;
    const [formValues, setFormValues] = useState<MaterialDto>(initialValues);
    let modalTitle;
    if (editingMaterialId) {
        modalTitle = isEditMode ? "자재 수정" : "자재 정보";
    } else {
        modalTitle = "자재 추가";
    }

    const fetchMaterialContentList = async () => {
        try {
            const fetchedMaterialContentList = await getMaterialContentList();
            setMaterialContentList(fetchedMaterialContentList);
        } catch (error) {
            console.error("Failed to fetch material list:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchMaterialContentList();

                const fetchedSupplierList = await getSupplierList();
                setSupplierList(fetchedSupplierList);
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
        const {name, spec, supplierDto} = formValues;

        setValidFields(
            name.trim() !== '' &&
            spec.trim() !== '' &&
            supplierDto?.id !== 0
        );
    };

    const sortMaterialContentList = (list: MaterialContentDto[]) => {
        const sortedList = [...list].sort((a, b) => {
            if (sortBy === "name") {
                return a.name.localeCompare(b.name);
            } else if (sortBy === "spec") {
                return a.spec.localeCompare(b.spec);
            } else if (sortBy === "supplier") {
                return (
                    (a.supplierDto?.companyName || "").localeCompare(
                        b.supplierDto?.companyName || ""
                    )
                );
            } else if (sortBy === "currentQuantity" ||
                sortBy === "expectedInboundQuantity" ||
                sortBy === "plannedConsumptionQuantity" ||
                sortBy === "actualQuantity") {
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

    const submitAddMaterial = async () => {
        validateFields();
        if (validFields) {
            await addMaterial(formValues);
            setFormValues(initialValues);
            setShow(false);
            await fetchMaterialContentList();
        }
    };

    const submitUpdateMaterial = async () => {
        validateFields();
        if (editingMaterialId && validFields) {
            await updateMaterial(editingMaterialId, formValues);
            setFormValues(initialValues);
            setEditingMaterialId(null);
            setShow(false);
            await fetchMaterialContentList();
        }
    };

    const submitDeleteMaterial = async () => {
        if (editingMaterialId) {
            await deleteMaterial(editingMaterialId);
            setFormValues(initialValues);
            setEditingMaterialId(null);
            setShow(false);
            await fetchMaterialContentList();
        }
    };

    const handleClose = () => {
        setFormValues(initialValues);

        setEditingMaterialId(null);
        setShow(false);
    };

    const handleShowAdd = () => {
        setInputTouched({
            name: false,
            spec: false,
            supplierDto: false
        });
        setFormValues(initialValues);
        setIsEditMode(true);
        setEditingMaterialId(null);
        setShow(true);
    };

    const handleShowEdit = (materialContent: MaterialContentDto) => {
        setFormValues({
            id: materialContent.id,
            name: materialContent.name,
            spec: materialContent.spec,
            details: materialContent.details,
            supplierDto: materialContent.supplierDto
        });
        setInputTouched({
            name: false,
            spec: false,
            supplierDto: false
        });
        setIsEditMode(false);
        setEditingMaterialId(materialContent.id);
        setShow(true);
    };

    return (
        <div className={styles.content}>
            <div className={styles.title}>자재 - 자재 목록</div>
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
                    <option value="name">자재명</option>
                    <option value="spec">규격</option>
                    <option value="supplier">공급처</option>
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
                            <Form.Label>자재명</Form.Label>
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
                                자재명을 입력해주세요.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="spec">
                            <Form.Label>규격</Form.Label>
                            <Form.Control
                                type="text"
                                value={formValues.spec}
                                onChange={(e) => {
                                    setFormValues({...formValues, spec: e.target.value});
                                    setInputTouched({...inputTouched, spec: true});
                                    validateFields();
                                }}
                                isInvalid={!validFields && inputTouched.spec && formValues.spec.trim() === ''}
                                disabled={!isEditMode}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                규격을 입력해주세요.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="supplier">
                            <Form.Label>공급처</Form.Label>
                            <Form.Control
                                as="select"
                                value={formValues.supplierDto?.id || 0}
                                onChange={(e) => {
                                    setFormValues({
                                        ...formValues,
                                        supplierDto: {
                                            ...formValues.supplierDto,
                                            id: parseInt(e.target.value),
                                            tel: "",
                                            loc: "",
                                            managerName: "",
                                            companyName: ""
                                        }
                                    });
                                    setInputTouched({...inputTouched, supplierDto: true});
                                    validateFields();
                                }}
                                isInvalid={!validFields && inputTouched.supplierDto && formValues.supplierDto?.id === 0}
                                disabled={!isEditMode}
                                required
                            >
                                <option value="0">공급처를 선택해주세요</option>
                                {supplierList.map((supplier) => (
                                    <option key={supplier.id} value={supplier.id || 0}>
                                        {supplier.companyName}
                                    </option>
                                ))}
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                                공급처를 선택해주세요.
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
                                    setFormValues({ ...formValues, details: e.target.value })
                                }
                                disabled={!isEditMode}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        {editingMaterialId ? "닫기" : "취소"}
                    </Button>
                    {(currentUserInfo.role === "관리자" || currentUserInfo.role === "자재부") && (
                        <>
                            {editingMaterialId && !isEditMode ? (
                                <>
                                    <Button
                                        variant="danger"
                                        onClick={async () => {
                                            if (window.confirm("정말로 이 자재를 삭제하시겠습니까?")) {
                                                await submitDeleteMaterial();
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
                                    onClick={editingMaterialId ? submitUpdateMaterial : submitAddMaterial}
                                >
                                    {editingMaterialId ? "적용" : "추가"}
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
                            자재명 {sortBy === "name" && sortDirection === "asc" && <span>&uarr;</span>}
                            {sortBy === "name" && sortDirection === "desc" && <span>&darr;</span>}
                        </th>
                        <th onClick={() => handleSort("spec")}>
                            규격 {sortBy === "spec" && sortDirection === "asc" && <span>&uarr;</span>}
                            {sortBy === "spec" && sortDirection === "desc" && <span>&darr;</span>}
                        </th>
                        <th onClick={() => handleSort("supplier")}>
                            공급처 {sortBy === "supplier" && sortDirection === "asc" && <span>&uarr;</span>}
                            {sortBy === "supplier" && sortDirection === "desc" && <span>&darr;</span>}
                        </th>
                        <th onClick={() => handleSort("currentQuantity")}>
                            현재 수량 {sortBy === "currentQuantity" && sortDirection === "asc" && <span>&uarr;</span>}
                            {sortBy === "currentQuantity" && sortDirection === "desc" && <span>&darr;</span>}
                        </th>
                        <th onClick={() => handleSort("expectedInboundQuantity")}>
                            입고 예정 {sortBy === "expectedInboundQuantity" && sortDirection === "asc" &&
                            <span>&uarr;</span>}
                            {sortBy === "expectedInboundQuantity" && sortDirection === "desc" && <span>&darr;</span>}
                        </th>
                        <th onClick={() => handleSort("plannedConsumptionQuantity")}>
                            소모 예정 {sortBy === "plannedConsumptionQuantity" && sortDirection === "asc" &&
                            <span>&uarr;</span>}
                            {sortBy === "plannedConsumptionQuantity" && sortDirection === "desc" && <span>&darr;</span>}
                        </th>
                        <th onClick={() => handleSort("actualQuantity")}>
                            실제 수량 {sortBy === "actualQuantity" && sortDirection === "asc" && <span>&uarr;</span>}
                            {sortBy === "actualQuantity" && sortDirection === "desc" && <span>&darr;</span>}
                        </th>

                    </tr>
                    </thead>
                    <tbody>
                    {sortMaterialContentList(materialContentList)
                        .filter((materialContent) => {
                            if (searchOption === "name") {
                                return materialContent.name.toLowerCase().includes(searchKeyword.toLowerCase());
                            } else if (searchOption === "spec") {
                                return materialContent.spec.toLowerCase().includes(searchKeyword.toLowerCase());
                            } else if (searchOption === "supplier") {
                                return (
                                    materialContent.supplierDto?.companyName
                                        .toLowerCase()
                                        .includes(searchKeyword.toLowerCase()) || searchKeyword === ""
                                );
                            } else {
                                return true;
                            }
                        }).map((materialContent) => (
                            <tr key={materialContent.id} onClick={() => handleShowEdit(materialContent)}>
                                <td>{materialContent.name}</td>
                                <td>{materialContent.spec}</td>
                                <td>{materialContent.supplierDto?.companyName}</td>
                                <td>{materialContent.currentQuantity}</td>
                                <td>{materialContent.expectedInboundQuantity}</td>
                                <td>{materialContent.plannedConsumptionQuantity}</td>
                                <td>{materialContent.actualQuantity}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </div>
    );
};

export default MaterialContent;
