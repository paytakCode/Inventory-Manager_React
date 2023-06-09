import React, {useEffect, useState} from "react";
import {addBuyer, deleteBuyer, getBuyerContentList, updateBuyer} from "services/salesService";
import Table from 'react-bootstrap/Table';
import {Form, Modal} from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import {BuyerDto} from "components/Base/BuyerDto";
import {BuyerContentDto} from "components/Content/BuyerContentDto";
import {getCurrentUserInfo} from "services/userService";
import styles from "pages/Content/CommonContent.module.scss";

const BuyerContent = () => {
    const currentUserInfo = getCurrentUserInfo();
    const [buyerContentList, setBuyerContentList] = useState<BuyerContentDto[]>([]);
    const [show, setShow] = useState(false);
    const [editingBuyerId, setEditingBuyerId] = useState<number | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [sortBy, setSortBy] = useState<string | undefined>(undefined);
    const [sortDirection, setSortDirection] = useState<string>("asc");
    const [searchKeyword, setSearchKeyword] = useState("");
    const [searchOption, setSearchOption] = useState("");
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

    const sortBuyerContentList = (list: BuyerContentDto[]) => {
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
        <div className={styles.content}>
            <div className={styles.title}>영업 - 구매처 관리</div>
            <div className={styles.searchContainer}>
                <div className={styles.addButton}>
                    {(currentUserInfo.role === "관리자" || currentUserInfo.role === "영업부") && (
                        <Button variant="primary" onClick={handleShowAdd}>
                            추가
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
                    {sortBuyerContentList(buyerContentList)
                        .filter((buyerContent) => {
                            if (searchOption === "companyName") {
                                return buyerContent.companyName.toLowerCase().includes(searchKeyword.toLowerCase());
                            } else if (searchOption === "managerName") {
                                return buyerContent.managerName.toLowerCase().includes(searchKeyword.toLowerCase());
                            } else {
                                return true;
                            }
                        }).map((buyerContent) => (
                            <tr key={buyerContent.id} onClick={() => handleShowEdit(buyerContent)}>
                                <td>{buyerContent.companyName}</td>
                                <td>{buyerContent.managerName}</td>
                                <td>{buyerContent.tel}</td>
                                <td>{buyerContent.loc}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </div>
    );
};

export default BuyerContent;
;
