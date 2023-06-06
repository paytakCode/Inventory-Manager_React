import React, {useEffect, useState} from "react";
import {
    addMaterialPurchase,
    deleteMaterialPurchase,
    getMaterialList,
    getMaterialPurchaseContentList,
    getMaterialRequestList,
    updateMaterialPurchase
} from "services/materialService";
import {MaterialPurchaseDto} from "components/Base/MaterialPurchaseDto";
import {MaterialPurchaseContentDto} from "components/MaterialPurchaseContentDto";
import {Form, Modal, Table} from "react-bootstrap";
import {getCurrentUserInfo, getUserList} from "services/userService";
import Button from "react-bootstrap/Button";
import {MaterialDto} from "components/Base/MaterialDto";
import {UserInfoDto} from "components/Base/UserInfoDto";
import {MaterialRequestDto} from "../../components/Base/MaterialRequestDto";
import PurchaseStatus from "../../components/Base/PurchaseStatus";

const MaterialPurchaseContent = () => {
    const currentUserInfo = getCurrentUserInfo();
    const [materialRequestList, setMaterialRequestList] = useState<MaterialRequestDto[]>([]);
    const [materialPurchaseContentList, setMaterialPurchaseContentList] = useState<MaterialPurchaseContentDto[]>([]);
    const [materialList, setMaterialList] = useState<MaterialDto[]>([]);
    const [userList, setUserList] = useState<UserInfoDto[]>([]);
    const [show, setShow] = useState(false);
    const initialValues = {
        materialDto: {
            name: "",
            spec: ""
        },
        price: 0,
        quantity: 0,
        managerDto: currentUserInfo
    } as MaterialPurchaseDto;

    const [formValues, setFormValues] = useState<MaterialPurchaseDto>(initialValues);
    const [editingMaterialPurchaseId, setEditingMaterialPurchaseId] = useState<number | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    let modalTitle;
    if (editingMaterialPurchaseId) {
        modalTitle = isEditMode ? "구매 정보 수정" : "구매 정보";
    } else {
        modalTitle = "구매 추가";
    }

    const fetchMaterialPurchaseContentList = async () => {
        try {
            const fetchedMaterialPurchaseContentList = await getMaterialPurchaseContentList();
            setMaterialPurchaseContentList(fetchedMaterialPurchaseContentList);
        } catch (error) {
            console.error("Failed to fetch material purchase Content list:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchMaterialPurchaseContentList();

                const fetchedMaterialList = await getMaterialList();
                setMaterialList(fetchedMaterialList);

                const fetchedUserList = await getUserList();
                setUserList(fetchedUserList);

                const fetchedMaterialRequestList = await getMaterialRequestList();
                setMaterialRequestList(fetchedMaterialRequestList);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };

        fetchData();
    }, []);


    const submitAddMaterialPurchase = async () => {
        console.log("제출전" + JSON.stringify(formValues));
        await addMaterialPurchase(formValues);
        setFormValues(initialValues);
        setShow(false);
        await fetchMaterialPurchaseContentList();
    };

    const submitUpdateMaterialPurchase = async () => {
        if (editingMaterialPurchaseId) {
            await updateMaterialPurchase(editingMaterialPurchaseId, formValues);
            setFormValues(initialValues);
            setEditingMaterialPurchaseId(null);
            setShow(false);
            await fetchMaterialPurchaseContentList();
        }
    };

    const submitDeleteMaterialPurchase = async () => {
        if (editingMaterialPurchaseId) {
            await deleteMaterialPurchase(editingMaterialPurchaseId);
            setFormValues(initialValues);
            setEditingMaterialPurchaseId(null);
            setShow(false);
            await fetchMaterialPurchaseContentList();
        }
    };

    const handleClose = () => {
        setFormValues(initialValues);
        setEditingMaterialPurchaseId(null);
        setIsEditMode(false);
        setShow(false);
    };

    const handleShowAdd = () => {
        setFormValues(initialValues);
        setIsEditMode(true);
        setEditingMaterialPurchaseId(null);
        setShow(true);
    };

    const handleShowEdit = (materialPurchaseContent: MaterialPurchaseContentDto) => {
        setFormValues({
            id : materialPurchaseContent.id,
            materialDto: materialPurchaseContent.materialDto,
            managerDto: materialPurchaseContent.managerDto,
            materialRequestDto: materialPurchaseContent.materialRequestDto,
            details: materialPurchaseContent.details,
            lotNo: materialPurchaseContent.lotNo,
            price: materialPurchaseContent.price,
            quantity : materialPurchaseContent.quantity,
            status: materialPurchaseContent.status
        });
        setIsEditMode(false);
        if(materialPurchaseContent.id){
            setEditingMaterialPurchaseId(materialPurchaseContent.id);
        }
        setShow(true);
    };
    return (
        <>
            <div>메인 컨테이너</div>
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
                            <Form.Label>구매 자재</Form.Label>
                            <Form.Control
                                as="select"
                                value={formValues.materialDto?.id || 0}
                                onChange={(e) =>
                                    setFormValues({
                                        ...formValues,
                                        materialDto: {
                                            ...formValues.materialDto,
                                            id: parseInt(e.target.value),
                                        },
                                    })
                                }
                                disabled={!isEditMode}
                            >
                                <option value="">자재를 선택해주세요</option>
                                {materialList.map((material) => (
                                    <option key={material.id} value={material.id || 0}>
                                        {material.name} - {material.spec}
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
                                <option value={currentUserInfo.id}>{currentUserInfo.name} - {currentUserInfo.email}</option>
                                {userList.map((user) => (currentUserInfo.id !== user.id) && (
                                    <option key={user.id} value={user.id}>
                                        {user.name} - {user.email}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="request">
                            <Form.Label>관련 요청</Form.Label>
                            <Form.Control
                                as="select"
                                value={formValues.materialRequestDto?.id || ""}
                                onChange={(e) => {
                                    const selectedRequestId = parseInt(e.target.value);
                                    const selectedMaterialRequest = materialRequestList.find(
                                        (materialRequest) => materialRequest.id === selectedRequestId
                                    );
                                    setFormValues({
                                        ...formValues,
                                        materialRequestDto: selectedMaterialRequest || null,
                                    });
                                }}
                                disabled={!isEditMode}
                            >
                                {formValues.materialRequestDto && (
                                    <option key={formValues.materialRequestDto.id} value={formValues.materialRequestDto.id || ""}>
                                        {formValues.materialRequestDto.materialDto?.name} : {formValues.materialRequestDto.quantity}
                                    </option>
                                )}
                                {!formValues.materialRequestDto && (
                                    <option value="" disabled>
                                        관련 요청 없음
                                    </option>
                                )}
                                {materialRequestList
                                    .filter(
                                        (materialRequest) =>
                                            !materialRequest.materialPurchaseDto &&
                                            (!formValues.materialRequestDto || materialRequest.id !== formValues.materialRequestDto.id)
                                    )
                                    .map((materialRequest) => (
                                        <option key={materialRequest.id} value={materialRequest.id || ""}>
                                            {materialRequest.materialDto?.name} : {materialRequest.quantity}
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
                        <Form.Group className="mb-3" controlId="price">
                            <Form.Label>총 구매가</Form.Label>
                            <Form.Control
                                type="number"
                                value={formValues.price}
                                onChange={(e) =>
                                    setFormValues({ ...formValues, price: parseInt(e.target.value) })
                                }
                                disabled={!isEditMode}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="status">
                            <Form.Label>구매 상태</Form.Label>
                            <Form.Control
                                as="select"
                                value={formValues.status || PurchaseStatus.ACCEPTED}
                                onChange={(e) =>
                                    setFormValues({
                                        ...formValues,
                                        status: e.target.value as PurchaseStatus
                                    })
                                }
                                disabled={!isEditMode}
                            >
                                {Object.values(PurchaseStatus).map((status) => (
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
                        {editingMaterialPurchaseId ? "닫기" : "취소"}
                    </Button>
                    {(currentUserInfo.role === "관리자" || currentUserInfo.role === "자재부") && (
                        <>
                            {editingMaterialPurchaseId && !isEditMode ? (
                                <>
                                    <Button
                                        variant="danger"
                                        onClick={async () => {
                                            if (window.confirm("정말로 이 요청을 삭제하시겠습니까?")) {
                                                await submitDeleteMaterialPurchase();
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
                                    onClick={editingMaterialPurchaseId ? submitUpdateMaterialPurchase : submitAddMaterialPurchase}
                                >
                                    {editingMaterialPurchaseId ? "적용" : "추가"}
                                </Button>
                            )}
                        </>
                    )}
                </Modal.Footer>
            </Modal>

            <Table striped bordered hover size="sm">
                <thead>
                <tr>
                    <th>구매 자재</th>
                    <th>수량</th>
                    <th>담당자</th>
                    <th>진행 상태</th>
                </tr>
                </thead>
                <tbody>
                {materialPurchaseContentList.map((materialPurchaseContent) => (
                    <tr key={materialPurchaseContent.id} onClick={() => handleShowEdit(materialPurchaseContent)}>
                        <td>{materialPurchaseContent.materialDto?.name}</td>
                        <td>{materialPurchaseContent.quantity}</td>
                        <td>{materialPurchaseContent.managerDto?.name}</td>
                        <td>{materialPurchaseContent.status}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </>
    );
};

export default MaterialPurchaseContent;
