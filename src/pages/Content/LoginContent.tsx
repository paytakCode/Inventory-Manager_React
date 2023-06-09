import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {isLogined, login} from 'services/authService';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import styles from 'pages/Content/LoginContent.module.scss';

interface LoginProps {
    email: string;
    password: string;
}

const LoginContent: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [validEmail, setValidEmail] = useState(true);
    const [validFields, setValidFields] = useState(true);
    const [inputTouched, setInputTouched] = useState({
        email: false,
        password: false,
    });

    useEffect(() => {
        if (isLogined()) {
            navigate('/main');
        }
    }, []);

    const [loginData, setLoginData] = useState<LoginProps>({
        email: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setLoginData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        setInputTouched((prevTouched) => ({
            ...prevTouched,
            [name]: true,
        }));
    };

    useEffect(() => {
        validateFields();
    }, [loginData]);

    const validateFields = () => {
        const {email, password} = loginData;
        const {email: emailTouched} = inputTouched;

        setValidEmail(
            (!emailTouched || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) &&
            (emailTouched || email !== '')
        );
        setValidFields(email !== '' && password !== '');
    };

    const handleLogin = () => {
        if (validEmail && validFields) {
            setLoading(true);
            login(loginData)
                .then(() => {
                    setLoading(false);
                    if (isLogined()) {
                        navigate('/main');
                    }
                })
                .catch(() => {
                    setLoading(false);
                });
        }
    };

    return (
        <>
            <div className={styles.login}>
                <Form>
                    <h3 className="text-center">로그인</h3>
                    <Form.Group controlId="email">
                        <Form.Label>이메일</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={loginData.email}
                            onChange={handleChange}
                            isInvalid={!validEmail && inputTouched.email}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            올바른 이메일 형식이 아닙니다.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="password">
                        <Form.Label>비밀번호</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            value={loginData.password}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <div className={styles.loginButton}>
                        <Button
                            variant="dark"
                            onClick={handleLogin}
                            disabled={loading || !validFields}
                        >
                            {loading ? '로딩 중...' : '로그인'}
                        </Button>
                    </div>
                </Form>
            </div>
        </>
    );
};

export default LoginContent;
