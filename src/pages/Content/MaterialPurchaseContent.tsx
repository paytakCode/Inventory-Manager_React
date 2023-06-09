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
import {MaterialPurchaseContentDto} from "components/Content/MaterialPurchaseContentDto";
import {Form, Modal, Table} from "react-bootstrap";
import {getCurrentUserInfo, getUserList} from "services/userService";
import Button from "react-bootstrap/Button";
import {MaterialDto} from "components/Base/MaterialDto";
import {UserInfoDto} from "components/Base/UserInfoDto";
import {MaterialRequestDto} from "../../components/Base/MaterialRequestDto";
import PurchaseStatus from "../../components/Base/PurchaseStatus";
import styles from "pages/Content/CommonContent.module.scss";

const MaterialPurchaseContent = () => {
    const currentUserInfo = getCurrentUserInfo();
    const [materialRequestList, setMaterialRequestList] = useState<MaterialRequestDto[]>([]);
    const [materialPurchaseContentList, setMaterialPurchaseContentList] = useState<MaterialPurchaseContentDto[]>([]);
    const [materialList, setMaterialList] = useState<MaterialDto[]>([]);
    const [userList, setUserList] = useState<UserInfoDto[]>([]);
    const [sortBy, setSortBy] = useState<string | undefined>(undefined);
    const [sortDirection, setSortDirection] = useState<string>("asc");
    const [searchKeyword, setSearchKeyword] = useState("");
    const [searchOption, setSearchOption] = useState("");
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

    const sortMaterialPurchaseContentList = (list: MaterialPurchaseContentDto[]) => {
        const sortedList = [...list].sort((a, b) => {
            if (sortBy === "name") {
                return a.materialDto.name.localeCompare(b.materialDto.name);
            } else if (sortBy === "manager") {
                return a.managerDto.name.localeCompare(b.managerDto.name);
            } else if (sortBy === "status") {
                return (
                    (a.status || "").localeCompare(
                        b.status || ""
                    )
                );
            } else if (sortBy === "quantity") {
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

    const submitAddMaterialPurchase = async () => {
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
        <div className={styles.content}>
            <div className={styles.title}>자재 - 자재 구매</div>
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
            <div className={styles.tableContainer}>
                <Table striped bordered hover size="sm">
                    <thead>
                    <tr>
                        <th onClick={() => handleSort("name")}>
                            자재명 {sortBy === "name" && sortDirection === "asc" && <span>&uarr;</span>}
                            {sortBy === "name" && sortDirection === "desc" && <span>&darr;</span>}
                        </th>
                        <th onClick={() => handleSort("quantity")}>
                            구매 수량 {sortBy === "quantity" && sortDirection === "asc" && <span>&uarr;</span>}
                            {sortBy === "quantity" && sortDirection === "desc" && <span>&darr;</span>}
                        </th>
                        <th onClick={() => handleSort("manager")}>
                            담당자 {sortBy === "manager" && sortDirection === "asc" && <span>&uarr;</span>}
                            {sortBy === "manager" && sortDirection === "desc" && <span>&darr;</span>}
                        </th>
                        <th onClick={() => handleSort("status")}>
                            진행 상태 {sortBy === "status" && sortDirection === "asc" && <span>&uarr;</span>}
                            {sortBy === "status" && sortDirection === "desc" && <span>&darr;</span>}
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {sortMaterialPurchaseContentList(materialPurchaseContentList)
                        .filter((materialPurchaseContent) => {
                            if (searchOption === "name") {
                                return materialPurchaseContent.materialDto.name.toLowerCase().includes(searchKeyword.toLowerCase());
                            } else if (searchOption === "manager") {
                                return materialPurchaseContent.managerDto.name.toLowerCase().includes(searchKeyword.toLowerCase());
                            } else {
                                return true;
                            }
                        }).map((materialPurchaseContent) => (
                            <tr key={materialPurchaseContent.id}
                                onClick={() => handleShowEdit(materialPurchaseContent)}>
                                <td>{materialPurchaseContent.materialDto.name}</td>
                                <td>{materialPurchaseContent.quantity}</td>
                                <td>{materialPurchaseContent.managerDto.name}</td>
                                <td>{materialPurchaseContent.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </div>
    );
};

export default MaterialPurchaseContent;
