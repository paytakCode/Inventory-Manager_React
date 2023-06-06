import React, {useEffect, useState} from "react";
import {addBuyer, deleteBuyer, getBuyerContentList, updateBuyer} from "services/salesService";
import Table from 'react-bootstrap/Table';
import {Form, Modal} from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import {BuyerDto} from "components/Base/BuyerDto";
import {BuyerContentDto} from "components/BuyerContentDto";
import {getCurrentUserInfo} from "services/userService";

const BuyerContent = () => {
    const currentUserInfo = getCurrentUserInfo();
    const [buyerContentList, setBuyerContentList] = useState<BuyerContentDto[]>([]);
    const [show, setShow] = useState(false);
    const [editingBuyerId, setEditingBuyerId] = useState<number | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const initialValues = {
        companyName: "",
        managerName: "",
        tel: "",
        loc: ""
    } as BuyerDto;
    const [formValues, setFormValues] = useState<BuyerDto>(initialValues);
    let modalTitle;

    if (editingBuyerId) {
        modalTitle = isEditMode ? "구매처 수정" : "구매처 정보";
    } else {
        modalTitle = "구매처 추가";
    }

    const fetchBuyerContentList = async () => {
        try {
            const fetchedBuyerContentList = await getBuyerContentList();
            setBuyerContentList(fetchedBuyerContentList);
        } catch (error) {
            console.error("Failed to fetch buyer Content list:", error);
        }
    };

    useEffect(() => {

        const fetchData = async () => {
            try {
                await fetchBuyerContentList();
            } catch (error) {
                console.error("Failed to fetch Data:", error);
            }
        };

        fetchData();
    }, []);


    const submitAddBuyer = async () => {
        await addBuyer(formValues);
        setFormValues(initialValues);
        setShow(false);
        await fetchBuyerContentList();
    };

    const submitUpdateBuyer = async () => {
        if (editingBuyerId) {
            await updateBuyer(editingBuyerId, formValues);
            setFormValues(initialValues);
            setEditingBuyerId(null);
            setShow(false);
            await fetchBuyerContentList();
        }
    };

    const submitDeleteBuyer = async () => {
        if (editingBuyerId) {
            await deleteBuyer(editingBuyerId);
            setFormValues(initialValues);
            setEditingBuyerId(null);
            setShow(false);
            await fetchBuyerContentList();
        }
    };

    const handleClose = () => {
        setFormValues(initialValues);

        setEditingBuyerId(null);
        setShow(false);
    };

    const handleShowAdd = () => {
        setFormValues(initialValues);
        setIsEditMode(true);
        setEditingBuyerId(null);
        setShow(true);
    };

    const handleShowEdit = (buyerContent: BuyerContentDto) => {
        setFormValues({
            id: buyerContent.id,
            companyName: buyerContent.companyName,
            managerName: buyerContent.managerName,
            tel: buyerContent.tel,
            loc: buyerContent.loc
        });

        setIsEditMode(false);
        setEditingBuyerId(buyerContent.id);
        setShow(true);
    };

    return (
        <>
            <div>Buyer</div>
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
                        {editingBuyerId ? "닫기" : "취소"}
                    </Button>
                    {(currentUserInfo.role === "관리자" || currentUserInfo.role === "영업부") && (
                        <>
                            {editingBuyerId && !isEditMode ? (
                                <>
                                    <Button
                                        variant="danger"
                                        onClick={async () => {
                                            if (window.confirm("정말로 구매처를 삭제하시겠습니까?")) {
                                                await submitDeleteBuyer();
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
                                    onClick={editingBuyerId ? submitUpdateBuyer : submitAddBuyer}
                                >
                                    {editingBuyerId ? "적용" : "추가"}
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
                {buyerContentList.map((buyerContent) => (
                    <tr key={buyerContent.id} onClick={() => handleShowEdit(buyerContent)}>
                        <td>{buyerContent.companyName}</td>
                        <td>{buyerContent.managerName}</td>
                        <td>{buyerContent.tel}</td>
                        <td>{buyerContent.loc}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </>
    );
};

export default BuyerContent;
;
