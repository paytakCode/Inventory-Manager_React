import React, {useEffect, useState} from "react";
import {
    addMaterialRequest,
    deleteMaterialRequest,
    getMaterialList,
    getMaterialRequestContentList,
    updateMaterialRequest
} from "services/materialService";
import {MaterialRequestContentDto} from "components/Content/MaterialRequestContentDto";
import {Form, Modal, Table} from "react-bootstrap";
import {getCurrentUserInfo, getUserList} from "services/userService";
import Button from "react-bootstrap/Button";
import {MaterialDto} from "components/Base/MaterialDto";
import {UserInfoDto} from "components/Base/UserInfoDto";
import {MaterialRequestDto} from "components/Base/MaterialRequestDto";
import {formatDate} from "utils/dateUtil";
import styles from "pages/Content/CommonContent.module.scss";

const MaterialRequestContent = () => {
    const currentUserInfo = getCurrentUserInfo();
    const [materialRequestContentList, setMaterialRequestList] = useState<MaterialRequestContentDto[]>([]);
    const [materialList, setMaterialList] = useState<MaterialDto[]>([]);
    const [userList, setUserList] = useState<UserInfoDto[]>([]);
    const [show, setShow] = useState(false);
    const [sortBy, setSortBy] = useState<string | undefined>(undefined);
    const [sortDirection, setSortDirection] = useState<string>("asc");
    const [searchKeyword, setSearchKeyword] = useState("");
    const [searchOption, setSearchOption] = useState("");
    const [validFields, setValidFields] = useState(true);
    const [inputTouched, setInputTouched] = useState({
        materialDto: false,
        requesterDto: false,
        quantity: false
    });
    const initialValues = {
        materialDto: {
            name: "",
            spec: ""
        },
        requesterDto: currentUserInfo,
        quantity: 1
    } as MaterialRequestDto;
    const [formValues, setFormValues] = useState<MaterialRequestDto>(initialValues);
    const [editingMaterialRequestId, setEditingMaterialRequestId] = useState<number | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    let modalTitle;
    if (editingMaterialRequestId) {
        modalTitle = isEditMode ? "요청 수정" : "요청 정보";
    } else {
        modalTitle = "요청 추가";
    }

    const fetchMaterialRequestContentList = async () => {
        try {
            const fetchedMaterialRequestContentList = await getMaterialRequestContentList();
            setMaterialRequestList(fetchedMaterialRequestContentList);
        } catch (error) {
            console.error("Failed to fetch material request Content list:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchMaterialRequestContentList();

                const fetchedMaterialList = await getMaterialList();
                setMaterialList(fetchedMaterialList);

                const fetchedUserList = await getUserList();
                setUserList(fetchedUserList);
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
        const {materialDto, quantity, requesterDto} = formValues;

        setValidFields(
            quantity >= 1 &&
            requesterDto?.id !== 0 &&
            materialDto?.id !== 0
        );
    };

    const sortMaterialRequestContentList = (list: MaterialRequestContentDto[]) => {
        const sortedList = [...list].sort((a, b) => {
            if (sortBy === "name") {
                return a.materialDto.name.localeCompare(b.materialDto.name);
            } else if (sortBy === "requester") {
                return a.requesterDto.name.localeCompare(b.requesterDto.name);
            } else if (sortBy === "status") {
                return (
                    (a.materialPurchaseDto?.status || "").localeCompare(
                        b.materialPurchaseDto?.status || ""
                    )
                );
            } else if (sortBy === "requestDate"
                || sortBy === "quantity") {
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

    const submitAddMaterialRequest = async () => {
        validateFields();
        if (validFields) {
            await addMaterialRequest(formValues);
            setFormValues(initialValues);
            setShow(false);
            await fetchMaterialRequestContentList();
        }
    };

    const submitUpdateMaterialRequest = async () => {
        if (editingMaterialRequestId && validFields) {
            await updateMaterialRequest(editingMaterialRequestId, formValues);

            setFormValues(initialValues);

            setEditingMaterialRequestId(null);
            setShow(false);
            await fetchMaterialRequestContentList();
        }
    };

    const submitDeleteMaterialRequest = async () => {
        if (editingMaterialRequestId) {
            await deleteMaterialRequest(editingMaterialRequestId);

            setFormValues(initialValues);

            setEditingMaterialRequestId(null);
            setShow(false);
            await fetchMaterialRequestContentList();
        }
    };

    const handleClose = () => {
        setFormValues(initialValues);
        setEditingMaterialRequestId(null);
        setShow(false);
    };

    const handleShowAdd = () => {
        setInputTouched({
            materialDto: false,
            requesterDto: false,
            quantity: false
        });
        setFormValues(initialValues);
        setIsEditMode(true);
        setEditingMaterialRequestId(null);
        setShow(true);
    };

    const handleShowEdit = (materialRequestContent: MaterialRequestContentDto) => {
        setFormValues({
            id: materialRequestContent.id,
            details: materialRequestContent.details,
            requesterDto: materialRequestContent.requesterDto,
            quantity: materialRequestContent.quantity,
            requestDate: materialRequestContent.requestDate,
            materialDto: materialRequestContent.materialDto,
            materialPurchaseDto: materialRequestContent.materialPurchaseDto
        });

        setInputTouched({
            materialDto: false,
            requesterDto: false,
            quantity: false
        });
        setIsEditMode(false);
        if (materialRequestContent.id) {
            setEditingMaterialRequestId(materialRequestContent.id);
        }
        setShow(true);
    };
    return (
        <div className={styles.content}>
            <div className={styles.title}>자재 - 자재 요청</div>
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
                    <option value="name">자재명</option>
                    <option value="manager">요청자</option>
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
                                as="select"
                                value={formValues.materialDto?.id || 0}
                                onChange={(e) => {
                                    setFormValues({
                                        ...formValues,
                                        materialDto: {
                                            ...formValues.materialDto,
                                            id: parseInt(e.target.value),
                                        },
                                    });
                                    setInputTouched({...inputTouched, materialDto: true});
                                    validateFields();
                                }}
                                isInvalid={!validFields && inputTouched.materialDto && formValues.materialDto?.id === 0}
                                disabled={!isEditMode}
                                required
                            >
                                <option value="0">자재를 선택해주세요</option>
                                {materialList.map((material) => (
                                    <option key={material.id} value={material.id || 0}>
                                        {material.name} - {material.spec}
                                    </option>
                                ))}
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                                자재를 선택해주세요.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="quantity">
                            <Form.Label>수량</Form.Label>
                            <Form.Control
                                type="number"
                                value={formValues.quantity}
                                onChange={(e) => {
                                    setFormValues({...formValues, quantity: parseInt(e.target.value)});
                                    setInputTouched({...inputTouched, quantity: true});
                                    validateFields();
                                }}
                                isInvalid={!validFields && inputTouched.quantity && formValues.quantity < 1}
                                disabled={!isEditMode}
                            />
                            <Form.Control.Feedback type="invalid">
                                1개 이상의 수량을 입력하세요.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="requester">
                            <Form.Label>요청자</Form.Label>
                            <Form.Control
                                as="select"
                                value={formValues.requesterDto.id}
                                onChange={(e) => {
                                    setFormValues({
                                        ...formValues,
                                        requesterDto: {
                                            ...formValues.requesterDto,
                                            id: parseInt(e.target.value),
                                        },
                                    });
                                    setInputTouched({...inputTouched, requesterDto: true});
                                    validateFields();
                                }}
                                isInvalid={!validFields && inputTouched.requesterDto && formValues.requesterDto?.id === 0}
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
                            <Form.Control.Feedback type="invalid">
                                요청자를 선택해주세요.
                            </Form.Control.Feedback>
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
                        {editingMaterialRequestId ? "닫기" : "취소"}
                    </Button>
                    {(currentUserInfo.role === "관리자" || currentUserInfo.role === "생산부") && (
                        <>
                            {editingMaterialRequestId && !isEditMode ? (
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
                                <Button
                                    variant="primary"
                                    onClick={editingMaterialRequestId ? submitUpdateMaterialRequest : submitAddMaterialRequest}
                                >
                                    {editingMaterialRequestId ? "적용" : "추가"}
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
                            요청 수량 {sortBy === "quantity" && sortDirection === "asc" && <span>&uarr;</span>}
                            {sortBy === "quantity" && sortDirection === "desc" && <span>&darr;</span>}
                        </th>
                        <th onClick={() => handleSort("requester")}>
                            요청자 {sortBy === "requester" && sortDirection === "asc" && <span>&uarr;</span>}
                            {sortBy === "requester" && sortDirection === "desc" && <span>&darr;</span>}
                        </th>
                        <th onClick={() => handleSort("requestDate")}>
                            요청일 {sortBy === "requestDate" && sortDirection === "asc" && <span>&uarr;</span>}
                            {sortBy === "requestDate" && sortDirection === "desc" && <span>&darr;</span>}
                        </th>
                        <th onClick={() => handleSort("status")}>
                            진행 상태 {sortBy === "status" && sortDirection === "asc" && <span>&uarr;</span>}
                            {sortBy === "status" && sortDirection === "desc" && <span>&darr;</span>}
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {sortMaterialRequestContentList(materialRequestContentList)
                        .filter((materialRequestContent) => {
                            if (searchOption === "name") {
                                return materialRequestContent.materialDto.name.toLowerCase().includes(searchKeyword.toLowerCase());
                            } else if (searchOption === "manager") {
                                return materialRequestContent.requesterDto.name.toLowerCase().includes(searchKeyword.toLowerCase());
                            } else {
                                return true;
                            }
                        }).map((materialRequestContent) => (
                            <tr key={materialRequestContent.id} onClick={() => handleShowEdit(materialRequestContent)}>
                                <td>{materialRequestContent.materialDto.name}</td>
                                <td>{materialRequestContent.quantity}</td>
                                <td>{materialRequestContent.requesterDto.name}</td>
                                <td>{formatDate(materialRequestContent.requestDate || new Date(''))}</td>
                                <td>{materialRequestContent.materialPurchaseDto?.status || "미확인"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </div>
    );
};

export default MaterialRequestContent;
