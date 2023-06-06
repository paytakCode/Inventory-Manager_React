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
import type {MaterialContentDto} from "components/MaterialContentDto";
import {SupplierDto} from "../../components/Base/SupplierDto";
import {getCurrentUserInfo} from "../../services/userService";
import {MaterialDto} from "../../components/Base/MaterialDto";

const MaterialContent = () => {
    const currentUserInfo = getCurrentUserInfo();
    const [materialContentList, setMaterialContentList] = useState<MaterialContentDto[]>([]);
    const [supplierList, setSupplierList] = useState<SupplierDto[]>([]);
    const [show, setShow] = useState(false);
    const [editingMaterialId, setEditingMaterialId] = useState<number | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
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
            }  catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };

        fetchData();
    }, []);


    const submitAddMaterial = async () => {
        await addMaterial(formValues);
        setFormValues(initialValues);
        setShow(false);
        await fetchMaterialContentList();
    };

    const submitUpdateMaterial = async () => {
        if (editingMaterialId) {
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

        setIsEditMode(false);
        setEditingMaterialId(materialContent.id);
        setShow(true);
    };

    return (
        <>
            <div>MaterialContent</div>
            {(currentUserInfo.role === "관리자" || currentUserInfo.role === "자재부") && (
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
                            <Form.Label>자재명</Form.Label>
                            <Form.Control
                                type="text"
                                autoFocus
                                value={formValues.name}
                                onChange={(e) =>
                                    setFormValues({ ...formValues, name: e.target.value })
                                }
                                disabled={!isEditMode}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="spec">
                            <Form.Label>규격</Form.Label>
                            <Form.Control
                                type="text"
                                value={formValues.spec}
                                onChange={(e) =>
                                    setFormValues({ ...formValues, spec: e.target.value })
                                }
                                disabled={!isEditMode}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="supplier">
                            <Form.Label>공급처</Form.Label>
                            <Form.Control
                                as="select"
                                value={formValues.supplierDto?.id || 0}
                                onChange={(e) =>
                                    setFormValues({
                                        ...formValues,
                                        supplierDto: {
                                            ...formValues.supplierDto,
                                            id: parseInt(e.target.value),
                                            tel: "",
                                            loc: "",
                                            managerName: "",
                                            companyName: ""
                                        },
                                    })
                                }
                                disabled={!isEditMode}
                            >
                                <option value="">공급처를 선택해주세요</option>
                                {supplierList.map((supplier) => (
                                    <option key={supplier.id} value={supplier.id || 0}>
                                        {supplier.companyName}
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

            <Table striped bordered hover size="sm">
                <thead>
                <tr>
                    <th>자재명</th>
                    <th>규격</th>
                    <th>공급처</th>
                    <th>현재 수량</th>
                    <th>입고 예정</th>
                    <th>소모 예정</th>
                    <th>실제 수량</th>
                </tr>
                </thead>
                <tbody>
                {materialContentList.map((materialContent) => (
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
        </>
    );
};

export default MaterialContent;
