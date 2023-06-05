import React, {useEffect, useState} from "react";
import {
    addMaterialRequest,
    deleteMaterialRequest,
    getMaterialList,
    getMaterialRequestList,
    updateMaterialRequest
} from "services/materialService";
import {MaterialRequestDto} from "components/Base/MaterialRequestDto";
import {Form, Modal, Table} from "react-bootstrap";
import {getCurrentUserInfo, getUserList} from "services/userService";
import Button from "react-bootstrap/Button";
import {MaterialDto} from "components/Base/MaterialDto";
import {UserInfoDto} from "components/Base/UserInfoDto";

const MaterialRequestContent = () => {
    const currentUserInfo = getCurrentUserInfo();
    const [materialRequestList, setMaterialRequestList] = useState<MaterialRequestDto[]>([]);
    const [materialList, setMaterialList] = useState<MaterialDto[]>([]);
    const [userList, setUserList] = useState<UserInfoDto[]>([]);
    const [show, setShow] = useState(false);
    const initialValues = {
        materialDto: {
            name: "",
            spec: ""
        },
        requesterDto: currentUserInfo,
        quantity: 0
    } as MaterialRequestDto;
    const [formValues, setFormValues] = useState<MaterialRequestDto>(initialValues);
    const [editingMaterialRequestId, setEditingMaterialRequestId] = useState<number | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        const fetchMaterialRequestList = async () => {
            try {
                const fetchedMaterialRequestList = await getMaterialRequestList();
                setMaterialRequestList(fetchedMaterialRequestList);
            } catch (error) {
                console.error("Failed to fetch material list:", error);
            }
        };

        const fetchMaterialList = async () => {
            try {
                const fetchedMaterialList = await getMaterialList();
                setMaterialList(fetchedMaterialList);
            } catch (error) {
                console.error("Failed to fetch material list:", error);
            }
        };

        const fetchUserList = async () => {
            try {
                const fetchedUserList = await getUserList();
                setUserList(fetchedUserList);
            } catch (error) {
                console.error("Failed to fetch user list:", error);
            }
        };

        fetchMaterialRequestList();
        fetchMaterialList();
        fetchUserList();
    }, []);

    const fetchMaterialRequestList = async () => {
        try {
            const fetchedMaterialRequestList = await getMaterialRequestList();
            setMaterialRequestList(fetchedMaterialRequestList);
        } catch (error) {
            console.error("Failed to fetch material request list:", error);
        }
    };


    const submitAddMaterialRequest = async () => {


        await addMaterialRequest(formValues);

        setFormValues(initialValues);

        setShow(false);
        await fetchMaterialRequestList();
    };

    const submitUpdateMaterialRequest = async () => {
        if (editingMaterialRequestId) {
            await updateMaterialRequest(editingMaterialRequestId, formValues);

            setFormValues(initialValues);

            setEditingMaterialRequestId(null);
            setShow(false);
            await fetchMaterialRequestList();
        }
    };

    const submitDeleteMaterialRequest = async () => {
        if (editingMaterialRequestId) {
            await deleteMaterialRequest(editingMaterialRequestId);

            setFormValues(initialValues);

            setEditingMaterialRequestId(null);
            setShow(false);
            await fetchMaterialRequestList();
        }
    };

    const handleClose = () => {
        setFormValues(initialValues);
        setEditingMaterialRequestId(null);
        setShow(false);
    };

    const handleShowAdd = () => {
        setFormValues(initialValues);
        setIsEditMode(true);
        setEditingMaterialRequestId(null);
        setShow(true);
    };

    const handleShowEdit = (materialRequest: MaterialRequestDto) => {
        setFormValues({
            id: materialRequest.id,
            details: materialRequest.details,
            requesterDto: materialRequest.requesterDto,
            quantity: materialRequest.quantity,
            requestDate: materialRequest.requestDate,
            materialDto: materialRequest.materialDto,
            materialPurchaseDto: materialRequest.materialPurchaseDto
        });

        setIsEditMode(false);
        if(materialRequest.id){
            setEditingMaterialRequestId(materialRequest.id);
        }
        setShow(true);
    };
    return (
        <>
            <div>메인 컨테이너</div>
            {(currentUserInfo.role === "관리자" || currentUserInfo.role === "생산부") && (
                <Button variant="primary" onClick={handleShowAdd}>
                    +
                </Button>
            )}

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingMaterialRequestId ? (!isEditMode ? "요청 정보" : "요청 수정") : "요청 추가"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="name">
                            <Form.Label>자재명</Form.Label>
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
                        <Form.Group className="mb-3" controlId="requester">
                            <Form.Label>요청자</Form.Label>
                            <Form.Control
                                as="select"
                                value={formValues.requesterDto.id}
                                onChange={(e) =>
                                    setFormValues({
                                        ...formValues,
                                        requesterDto: {
                                            ...formValues.requesterDto,
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
                        <Form.Group
                            className="mb-3"
                            controlId="details"
                        >
                            <Form.Label>요청내용</Form.Label>
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
                        {editingMaterialRequestId ?  "닫기" : "취소"}
                    </Button>
                    {(currentUserInfo.role === "관리자" || currentUserInfo.role === "생산부") && (editingMaterialRequestId ? (
                        !isEditMode ? (
                            <>
                                <Button
                                    variant="danger"
                                    onClick={async () => {
                                        if (window.confirm("정말로 이 요청을 삭제하시겠습니까?")) {
                                            await submitDeleteMaterialRequest();
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
                            <Button variant="primary" onClick={submitUpdateMaterialRequest}>
                                적용
                            </Button>
                        )
                    ) : (
                        <Button variant="primary" onClick={submitAddMaterialRequest}>
                            추가
                        </Button>
                    ))}
                </Modal.Footer>
            </Modal>

            <Table striped bordered hover size="sm">
                <thead>
                <tr>
                    <th>요청 자재</th>
                    <th>수량</th>
                    <th>요청자</th>
                    <th>요청일</th>
                    <th>진행 상태</th>
                </tr>
                </thead>
                <tbody>
                {materialRequestList.map((materialRequest) => (
                    <tr key={materialRequest.id} onClick={() => handleShowEdit(materialRequest)}>
                        <td>{materialRequest.materialDto.name}</td>
                        <td>{materialRequest.quantity}</td>
                        <td>{materialRequest.requesterDto.name}</td>
                        <td>{materialRequest.requestDate?.toString()}</td>
                        <td>{materialRequest.materialPurchaseDto?.status || "미확인"}
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </>
    );
};

export default MaterialRequestContent;
