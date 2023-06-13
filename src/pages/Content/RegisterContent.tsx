import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {addUser} from 'services/userService';
import {UserDto} from '../../components/Base/UserDto';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import styles from 'pages/Content/RegisterContent.module.scss';

const RegisterContent: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const initialValues = {
        id: 0,
        email: '',
        password: '',
        name: '',
        tel: '',
    };
    const [registerData, setRegisterData] = useState<UserDto>(initialValues);
    const [validFields, setValidFields] = useState(false);
    const [inputTouched, setInputTouched] = useState({
        name: false,
        email: false,
        password: false,
        tel: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setRegisterData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        setInputTouched((prevFields) => ({
            ...prevFields,
            [name]: true,
        }));
    };

    useEffect(() => {
        validateFields();
    }, [registerData]);

    const validateFields = () => {
        const {name, email, password, tel} = registerData;

        setValidFields(
            name.trim() !== '' &&
            emailRegex.test(email) &&
            password.length >= 8 &&
            /^(\d{3}-\d{4}-\d{4})$/.test(tel.trim())
        );
    };


    const handleRegister = () => {
        validateFields();
        if (validFields) {
            setLoading(true);
            addUser(registerData)
                .then(() => {
                    setLoading(false);
                    navigate('/login');
                })
                .catch(() => {
                    setLoading(false);
                });
        } else {
            setInputTouched({
                name: true,
                email: true,
                password: true,
                tel: true,
            })
        }
    };

    return (
        <>
            <div className={styles.register}>
                <Form>
                    <h2 className="text-center">직원 등록</h2>
                    <Form.Group controlId="name">
                        <Form.Label>이름</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={registerData.name}
                            onChange={handleChange}
                            required
                            isInvalid={!validFields && inputTouched.name && registerData.name.trim() === ''}
                        />
                        <Form.Control.Feedback type="invalid">
                            이름을 입력해주세요.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="email">
                        <Form.Label>이메일</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={registerData.email}
                            onChange={handleChange}
                            required
                            isInvalid={!validFields && inputTouched.email && (!emailRegex.test(registerData.email) || registerData.email.trim() === '')}
                        />
                        <Form.Control.Feedback type="invalid">
                            이메일을 형식에 맞게 입력해주세요.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="password">
                        <Form.Label>비밀번호</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            value={registerData.password}
                            onChange={handleChange}
                            required
                            isInvalid={!validFields && inputTouched.password && (registerData.password.length < 8 || registerData.password.trim() === '')}
                        />
                        <Form.Control.Feedback type="invalid">
                            비밀번호를 8자 이상 입력해주세요.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="tel">
                        <Form.Label>전화번호</Form.Label>
                        <Form.Control
                            type="tel"
                            name="tel"
                            value={registerData.tel}
                            onChange={handleChange}
                            required
                            isInvalid={!validFields && inputTouched.tel && (!/^(\d{3}-\d{4}-\d{4})$/.test(registerData.tel.trim()) || registerData.tel.trim() === '')}
                        />
                        <Form.Control.Feedback type="invalid">
                            전화번호 형식에 맞춰 작성해주세요.
                            예) 010-1234-5678
                        </Form.Control.Feedback>
                    </Form.Group>
                    <div className={styles.registerButton}>
                        <Button
                            variant="dark"
                            onClick={handleRegister}
                            disabled={loading || !validFields}
                        >
                            {loading ? '로딩 중...' : '등록'}
                        </Button>
                    </div>
                </Form>
            </div>
        </>
    );
};

export default RegisterContent;
