import React, {useEffect, useState} from "react";
import {
    addProductMaterial,
    deleteProductMaterial,
    getProductMaterialContentList,
    updateProductMaterial
} from "services/productService";
import Table from 'react-bootstrap/Table';
import {Form, Modal} from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import {getCurrentUserInfo} from "services/userService";
import {ProductMaterialDto} from "components/Base/ProductMaterialDto";
import {ProductMaterialContentDto} from "components/Content/ProductMaterialContentDto";
import {ProductMaterialIdDto} from "../../components/Base/ProductMaterialIdDto";
import {MaterialDto} from "../../components/Base/MaterialDto";
import {getMaterialContentList, getMaterialList} from "../../services/materialService";
import {MaterialContentDto} from "../../components/Content/MaterialContentDto";
import styles from "pages/Content/CommonContent.module.scss";

const ProductMaterialContent = () => {
    const currentUserInfo = getCurrentUserInfo();
    const [productMaterialContentList, setProductMaterialContentList] = useState<ProductMaterialContentDto[]>([]);
    const [materialContentMap, setMaterialContentMap] = useState<Map<number, MaterialContentDto>>(new Map<number, MaterialContentDto>());
    const [productMaterialListMap, setProductMaterialListMap] = useState<Map<number, ProductMaterialDto[]>>(new Map<number, ProductMaterialDto[]>());
    const [materialList, setMaterialList] = useState<MaterialDto[]>([]);
    const [productQuantity, setProductQuantity] = useState(1);
    const [show, setShow] = useState(false);
    const [showBom, setShowBom] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const [selectedProductName, setSelectedProductName] = useState<string | null>(null);
    const [editingProductMaterialId, setEditingProductMaterialId] = useState<ProductMaterialIdDto | null>(null);
    const [productSortBy, setProductSortBy] = useState<string | undefined>(undefined);
    const [productSortDirection, setProductSortDirection] = useState<string>("asc");
    const [productSearchKeyword, setProductSearchKeyword] = useState("");
    const [productSearchOption, setProductSearchOption] = useState("");
    const [materialSortBy, setMaterialSortBy] = useState<string | undefined>(undefined);
    const [materialSortDirection, setMaterialSortDirection] = useState<string>("asc");
    const [materialSearchKeyword, setMaterialSearchKeyword] = useState("");
    const [materialSearchOption, setMaterialSearchOption] = useState("");
    const [isEditMode, setIsEditMode] = useState(false);
    const [validFields, setValidFields] = useState(true);
    const [inputTouched, setInputTouched] = useState({
        materialDto: false,
        requiredQuantity: false
    });
    const initialValues = {
        productMaterialIdDto: {
            productDto: {
                id: 0,
                name: ""
            },
            materialDto: {
                id: 0,
                spec: ""
            }
        },
        requiredQuantity: 1
    } as ProductMaterialDto;
    const [formValues, setFormValues] = useState<ProductMaterialDto>(initialValues);
    let modalTitle;
    if (editingProductMaterialId) {
        modalTitle = isEditMode ? "제품 자재 수정" : "제품 자재 정보";
    } else {
        modalTitle = "제품 자재 추가";
    }

    const fetchProductMaterialContentList = async () => {
        try {
            const fetchedProductMaterialContentList = await getProductMaterialContentList();

            const updatedProductMaterialListMap = new Map<number, ProductMaterialDto[]>();
            for (const productMaterialContent of fetchedProductMaterialContentList) {
                updatedProductMaterialListMap.set(productMaterialContent.productDto.id, productMaterialContent.productMaterialDtoList);
            }
            setProductMaterialContentList(fetchedProductMaterialContentList);
            setProductMaterialListMap(updatedProductMaterialListMap);
        } catch (error) {
            console.error("Failed to fetch productMaterialContent list:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchProductMaterialContentList();

                const fechedMaterialContentList = await getMaterialContentList();

                const updatedMaterialContentMap = new Map<number, MaterialContentDto>();
                for (const materialContent of fechedMaterialContentList) {
                    if (materialContent.id != null) {
                        updatedMaterialContentMap.set(materialContent.id, materialContent);
                    }
                }
                setMaterialContentMap(updatedMaterialContentMap);

                const fetchedMaterialList = await getMaterialList();
                setMaterialList(fetchedMaterialList);
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
        const {productMaterialIdDto, requiredQuantity} = formValues;

        setValidFields(
            requiredQuantity >= 1 &&
            productMaterialIdDto.materialDto.id !== 0
        );
    };

    const sortProductMaterialContentList = (list: ProductMaterialContentDto[]) => {
        const sortedList = [...list].sort((a, b) => {
            if (productSortBy === "name") {
                return a.productDto.name.localeCompare(b.productDto.name);
            } else if (productSortBy === "spec") {
                return (a.productDto.spec || "").localeCompare(b.productDto.spec || "");
            } else {
                return 0;
            }
        });

        return productSortDirection === "desc" ? sortedList.reverse() : sortedList;
    };


    const handleProductSort = (column: string) => {
        setProductSearchKeyword("");
        if (column === productSortBy) {
            setProductSortDirection(productSortDirection === "asc" ? "desc" : "asc");
        } else {
            setProductSortBy(column);
            setProductSortDirection("asc");
        }
    };

    const sortProductMaterialList = (list: ProductMaterialDto[]) => {
        const sortedList = [...list].sort((a, b) => {
            if (materialSortBy === "materialName") {
                return a.productMaterialIdDto.materialDto.name.localeCompare(b.productMaterialIdDto.materialDto.name);
            } else {
                return 0;
            }
        });

        return productSortDirection === "desc" ? sortedList.reverse() : sortedList;
    };


    const handleMaterialSort = (column: string) => {
        setMaterialSearchKeyword("");
        if (column === materialSortBy) {
            setMaterialSortDirection(productSortDirection === "asc" ? "desc" : "asc");
        } else {
            setMaterialSortBy(column);
            setMaterialSortDirection("asc");
        }
    };

    const handleCloseBOM = () => {
        setSelectedProductId(null);
        setSelectedProductName(null);
        setShowBom(false);
    };

    const handleShowBOM = (productName: string, productId: number) => {
        setProductQuantity(1);
        setSelectedProductId(productId);
        setSelectedProductName(productName);
        setShowBom(true);
    };


    const submitAddProductMaterial = async () => {
        validateFields();
        if (validFields) {
            await addProductMaterial(formValues);
            setFormValues(initialValues);
            setShow(false);
            await fetchProductMaterialContentList();
        } else {
            setInputTouched({
                materialDto: true,
                requiredQuantity: true
            });
        }
    };

    const submitUpdateProductMaterial = async () => {
        validateFields();
        if (editingProductMaterialId && validFields) {
            await updateProductMaterial(editingProductMaterialId, formValues);
            setFormValues(initialValues);
            setEditingProductMaterialId(null);
            setShow(false);
            await fetchProductMaterialContentList();
        } else {
            setInputTouched({
                materialDto: true,
                requiredQuantity: true
            });
        }
    };

    const submitDeleteProductMaterial = async () => {
        if (editingProductMaterialId) {
            await deleteProductMaterial(editingProductMaterialId);
            setFormValues(initialValues);
            setEditingProductMaterialId(null);
            setShow(false);
            await fetchProductMaterialContentList();
        }
    };

    const handleClose = () => {
        setFormValues(initialValues);
        setEditingProductMaterialId(null);
        setIsEditMode(false);
        setShow(false);
    };

    const handleShowAdd = () => {
        setInputTouched({
            materialDto: false,
            requiredQuantity: false
        });
        setFormValues(initialValues);
        setIsEditMode(true);
        setEditingProductMaterialId(null);
        setShow(true);
    };

    const handleShowEdit = (productMaterialDto: ProductMaterialDto) => {
        setFormValues({
            productMaterialIdDto: productMaterialDto.productMaterialIdDto,
            requiredQuantity: productMaterialDto.requiredQuantity
        });
        setInputTouched({
            materialDto: false,
            requiredQuantity: false
        });
        setIsEditMode(false);
        setEditingProductMaterialId(productMaterialDto.productMaterialIdDto);
        setShow(true);
    };

    return (
        <div className={styles.content}>
            <div className={styles.title}>제품 - 제품 BOM</div>
            <div className={styles.searchContainer}>
                <div className={styles.addButton}></div>
                <select value={productSearchOption} onChange={(e) => setProductSearchOption(e.target.value)}>
                    <option value="" disabled={true}>검색 옵션</option>
                    <option value="productName">제품명</option>
                </select>
                <input
                    type="text"
                    value={productSearchKeyword}
                    placeholder="검색어를 입력하세요"
                    onChange={(e) => setProductSearchKeyword(e.target.value)}
                />
                <button onClick={() => {
                    setProductSearchKeyword("");
                }}>
                    초기화
                </button>
            </div>
            <Modal show={showBom} onHide={handleCloseBOM} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>{selectedProductName}의 자재 목록</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="quantity">
                            <Form.Label>생산 예정 수량</Form.Label>
                            <Form.Control
                                type="number"
                                value={productQuantity}
                                onChange={(e) => setProductQuantity(parseInt(e.target.value))}
                            />
                        </Form.Group>
                    </Form>
                    <div className={styles.searchContainer}>
                        <div className={styles.addButton}>
                            {(currentUserInfo.role === "관리자" || currentUserInfo.role === "생산부") && (
                                <Button variant="primary" onClick={handleShowAdd}>
                                    추가
                                </Button>
                            )}
                        </div>
                        <select value={materialSearchOption} onChange={(e) => setMaterialSearchOption(e.target.value)}>
                            <option value="" disabled={true}>검색 옵션</option>
                            <option value="materialName">자재명</option>
                        </select>
                        <input
                            type="text"
                            value={materialSearchKeyword}
                            placeholder="검색어를 입력하세요"
                            onChange={(e) => setMaterialSearchKeyword(e.target.value)}
                        />
                        <button onClick={() => {
                            setMaterialSearchKeyword("");
                        }}>
                            초기화
                        </button>
                    </div>
                    {selectedProductId && productMaterialListMap.has(selectedProductId) && (
                        <div className={styles.tableContainer}>
                            <Table striped bordered hover size="sm">
                                <thead>
                                <tr>
                                    <th onClick={() => handleMaterialSort("materialName")}>
                                        자재명 {materialSortBy === "materialName" && materialSortDirection === "asc" &&
                                        <span>&uarr;</span>}
                                        {materialSortBy === "materialName" && materialSortDirection === "desc" &&
                                            <span>&darr;</span>}
                                    </th>
                                    <th onClick={() => handleMaterialSort("spec")}>
                                        규격 {materialSortBy === "spec" && materialSortDirection === "asc" &&
                                        <span>&uarr;</span>}
                                        {materialSortBy === "spec" && materialSortDirection === "desc" &&
                                            <span>&darr;</span>}
                                    </th>
                                    <th onClick={() => handleMaterialSort("requiredQuantity")}>
                                        필요
                                        수량 {materialSortBy === "requiredQuantity" && materialSortDirection === "asc" &&
                                        <span>&uarr;</span>}
                                        {materialSortBy === "requiredQuantity" && materialSortDirection === "desc" &&
                                            <span>&darr;</span>}
                                    </th>
                                    <th onClick={() => handleMaterialSort("currentQuantity")}>
                                        현재
                                        수량 {materialSortBy === "currentQuantity" && materialSortDirection === "asc" &&
                                        <span>&uarr;</span>}
                                        {materialSortBy === "currentQuantity" && materialSortDirection === "desc" &&
                                            <span>&darr;</span>}
                                    </th>
                                    <th onClick={() => handleMaterialSort("expectedInboundQuantity")}>
                                        입고
                                        수량 {materialSortBy === "expectedInboundQuantity" && materialSortDirection === "asc" &&
                                        <span>&uarr;</span>}
                                        {materialSortBy === "expectedInboundQuantity" && materialSortDirection === "desc" &&
                                            <span>&darr;</span>}
                                    </th>
                                    <th onClick={() => handleMaterialSort("plannedConsumptionQuantity")}>
                                        소모
                                        예정 {materialSortBy === "plannedConsumptionQuantity" && materialSortDirection === "asc" &&
                                        <span>&uarr;</span>}
                                        {materialSortBy === "plannedConsumptionQuantity" && materialSortDirection === "desc" &&
                                            <span>&darr;</span>}
                                    </th>
                                    <th onClick={() => handleMaterialSort("actualQuantity")}>
                                        실제 수량 {materialSortBy === "actualQuantity" && materialSortDirection === "asc" &&
                                        <span>&uarr;</span>}
                                        {materialSortBy === "actualQuantity" && materialSortDirection === "desc" &&
                                            <span>&darr;</span>}
                                    </th>
                                    <th>총 필요 수량</th>
                                </tr>
                                </thead>
                                <tbody>
                                {sortProductMaterialList(productMaterialListMap.get(selectedProductId) || [])
                                    .filter((productMaterial) => {
                                        if (materialSearchOption === "materialName") {
                                            return productMaterial.productMaterialIdDto.materialDto.name.toLowerCase().includes(materialSearchKeyword.toLowerCase());
                                        } else {
                                            return true;
                                        }
                                    }).map((productMaterial) => (
                                        <tr key={productMaterial.productMaterialIdDto.materialDto.id}
                                            onClick={() => handleShowEdit(productMaterial)}>
                                            <td>{productMaterial.productMaterialIdDto.materialDto.name}</td>
                                            <td>{productMaterial.productMaterialIdDto.materialDto.spec}</td>
                                            <td>{productMaterial.requiredQuantity}</td>
                                            <td>{materialContentMap.get(productMaterial.productMaterialIdDto.materialDto.id as number)?.currentQuantity}</td>
                                            <td>{materialContentMap.get(productMaterial.productMaterialIdDto.materialDto.id as number)?.expectedInboundQuantity}</td>
                                            <td>{materialContentMap.get(productMaterial.productMaterialIdDto.materialDto.id as number)?.plannedConsumptionQuantity}</td>
                                            <td>{materialContentMap.get(productMaterial.productMaterialIdDto.materialDto.id as number)?.actualQuantity}</td>
                                            <td>{productMaterial.requiredQuantity * productQuantity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
            <div className={styles.tableContainer}>
                <Table striped bordered hover size="sm">
                    <thead>
                    <tr>
                        <th onClick={() => handleProductSort("productName")}>
                            제품명 {productSortBy === "productName" && productSortDirection === "asc" &&
                            <span>&uarr;</span>}
                            {productSortBy === "productName" && productSortDirection === "desc" && <span>&darr;</span>}
                        </th>
                        <th onClick={() => handleProductSort("spec")}>
                            규격 {productSortBy === "spec" && productSortDirection === "asc" && <span>&uarr;</span>}
                            {productSortBy === "spec" && productSortDirection === "desc" && <span>&darr;</span>}
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {sortProductMaterialContentList(productMaterialContentList)
                        .filter((productionContent) => {
                            if (productSearchOption === "productName") {
                                return productionContent.productDto.name.toLowerCase().includes(productSearchKeyword.toLowerCase());
                            } else {
                                return true;
                            }
                        }).map((productMaterialContent) => (
                            <tr key={productMaterialContent.productDto.id}
                                onClick={() => handleShowBOM(productMaterialContent.productDto.name, productMaterialContent.productDto.id || 0)}>
                                <td>{productMaterialContent.productDto.name}</td>
                                <td>{productMaterialContent.productDto.spec}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
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
                                value={formValues.productMaterialIdDto.materialDto.id || 0}
                                onChange={(e) => {
                                    setFormValues({
                                        ...formValues,
                                        productMaterialIdDto: {
                                            productDto: {
                                                id: selectedProductId,
                                                name: "",
                                                spec: "",
                                                details: ""
                                            },
                                            materialDto: {
                                                id: parseInt(e.target.value),
                                                name: "",
                                                spec: "",
                                                details: "",
                                                supplierDto: null
                                            },
                                        },
                                    });
                                    setInputTouched({...inputTouched, materialDto: true});
                                    validateFields();
                                }}
                                isInvalid={!validFields && inputTouched.materialDto && formValues.productMaterialIdDto.materialDto.id === 0}
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
                                value={formValues.requiredQuantity}
                                onChange={(e) => {
                                    setFormValues({...formValues, requiredQuantity: parseInt(e.target.value)});
                                    setInputTouched({...inputTouched, requiredQuantity: true});
                                    validateFields();
                                }}
                                isInvalid={!validFields && inputTouched.requiredQuantity && formValues.requiredQuantity < 1}
                                disabled={!isEditMode}
                            />
                            <Form.Control.Feedback type="invalid">
                                1개 이상의 수량을 입력하세요.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        {editingProductMaterialId ? "닫기" : "취소"}
                    </Button>
                    {(currentUserInfo.role === "관리자" || currentUserInfo.role === "자재부") && (
                        <>
                            {editingProductMaterialId && !isEditMode ? (
                                <>
                                    <Button
                                        variant="danger"
                                        onClick={async () => {
                                            if (window.confirm("정말로 이 자재을 삭제하시겠습니까?")) {
                                                await submitDeleteProductMaterial();
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
                                    onClick={editingProductMaterialId ? submitUpdateProductMaterial : submitAddProductMaterial}
                                >
                                    {editingProductMaterialId ? "적용" : "추가"}
                                </Button>
                            )}
                        </>
                    )}
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ProductMaterialContent;
