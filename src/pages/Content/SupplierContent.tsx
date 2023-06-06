import React, {useEffect, useState} from "react";
import {addSupplier, deleteSupplier, getSupplierContentList, updateSupplier} from "services/materialService";
import Table from 'react-bootstrap/Table';
import {Form, Modal} from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import {SupplierDto} from "../../components/Base/SupplierDto";
import {SupplierContentDto} from "../../components/SupplierContentDto";
import {getCurrentUserInfo} from "../../services/userService";

const SupplierContent = () => {
    const currentUserInfo = getCurrentUserInfo();
    const [supplierContentList, setSupplierContentList] = useState<SupplierContentDto[]>([]);
    const [show, setShow] = useState(false);
    const [editingSupplierId, setEditingSupplierId] = useState<number | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
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


    const submitAddSupplier = async () => {
        await addSupplier(formValues);
        setFormValues(initialValues);
        setShow(false);
        await fetchSupplierContentList();
    };

    const submitUpdateSupplier = async () => {
        if (editingSupplierId) {
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

        setIsEditMode(false);
        setEditingSupplierId(supplierContent.id);
        setShow(true);
    };

    return (
        <>
            <div>Supplier</div>
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
                        <Form.Group className="mb-3" controlId="companyName">
                            <Form.Label>회사명</Form.Label>
                            <Form.Control
                                type="text"
                                autoFocus
                                value={formValues.companyName}
                                onChange={(e) =>
                                    setFormValues({ ...formValues, companyName: e.target.value })
                                }
                                disabled={!isEditMode}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="managerName">
                            <Form.Label>담당자</Form.Label>
                            <Form.Control
                                type="text"
                                value={formValues.managerName}
                                onChange={(e) =>
                                    setFormValues({ ...formValues, managerName: e.target.value })
                                }
                                disabled={!isEditMode}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="tel">
                            <Form.Label>연락처</Form.Label>
                            <Form.Control
                                type="tel"
                                value={formValues.tel}
                                onChange={(e) =>
                                    setFormValues({ ...formValues, tel: e.target.value })
                                }
                                disabled={!isEditMode}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="loc">
                            <Form.Label>주소</Form.Label>
                            <Form.Control
                                type="text"
                                value={formValues.loc}
                                onChange={(e) =>
                                    setFormValues({ ...formValues, loc: e.target.value })
                                }
                                disabled={!isEditMode}
                            />
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

            <Table striped bordered hover size="sm">
                <thead>
                <tr>
                    <th>회사명</th>
                    <th>담당자</th>
                    <th>연락처</th>
                    <th>주소</th>
                </tr>
                </thead>
                <tbody>
                {supplierContentList.map((supplierContent) => (
                    <tr key={supplierContent.id} onClick={() => handleShowEdit(supplierContent)}>
                        <td>{supplierContent.companyName}</td>
                        <td>{supplierContent.managerName}</td>
                        <td>{supplierContent.tel}</td>
                        <td>{supplierContent.loc}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </>
    );
};

export default SupplierContent;
;
