import React, {useState} from "react";
import {getCurrentUserInfo, updateUser} from "services/userService";
import {Button, Form} from "react-bootstrap";
import styles from "pages/Content/CommonContent.module.scss";

const UserProfileContent = () => {
    const currentUserInfo = getCurrentUserInfo();
    const [editMode, setEditMode] = useState(false);
    const [userInfo, setUserInfo] = useState(currentUserInfo);
    const [password, setPassword] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.name === "password") {
            setPassword(e.target.value);
        } else {
            setUserInfo((prevUserInfo) => ({
                ...prevUserInfo,
                [e.target.name]: e.target.value,
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        const user = {
            id: userInfo.id,
            email: userInfo.email,
            tel: userInfo.tel,
            name: userInfo.name,
            password: password,
        };

        e.preventDefault();
        updateUser(user).then((r) => setEditMode(false));
    };

    const toggleEditMode = () => {
        setEditMode(!editMode);
    };

    return (
        <div className={styles.content}>
            <div className={styles.title}>내정보</div>
            <div>
                {!editMode ? (
                    <>
                        <Form>
                            <Form.Group controlId="formName">
                                <Form.Label>이름:</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={userInfo.name}
                                    onChange={handleChange}
                                    disabled={true}
                                />
                            </Form.Group>
                            <Form.Group controlId="formEmail">
                                <Form.Label>Email:</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={userInfo.email}
                                    onChange={handleChange}
                                    disabled={true}
                                />
                            </Form.Group>
                            <Form.Group controlId="formTel">
                                <Form.Label>연락처:</Form.Label>
                                <Form.Control
                                    type="tel"
                                    name="tel"
                                    value={userInfo.tel}
                                    onChange={handleChange}
                                    disabled={true}
                                />
                            </Form.Group>
                            <Form.Group controlId="formRole">
                                <Form.Label>부서:</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="role"
                                    value={userInfo.role}
                                    disabled={true}
                                />
                            </Form.Group>
                            <Button variant="primary" onClick={toggleEditMode}>
                                수정하기
                            </Button>
                        </Form>
                    </>
                ) : (
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formName">
                            <Form.Label>이름:</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={userInfo.name}
                                onChange={handleChange}
                                disabled={true}
                            />
                        </Form.Group>
                        <Form.Group controlId="formEmail">
                            <Form.Label>Email:</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={userInfo.email}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formTel">
                            <Form.Label>연락처:</Form.Label>
                            <Form.Control
                                type="tel"
                                name="tel"
                                value={userInfo.tel}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formRole">
                            <Form.Label>부서:</Form.Label>
                            <Form.Control
                                type="text"
                                name="role"
                                value={userInfo.role}
                                disabled={true}
                            />
                        </Form.Group>
                        <Form.Group controlId="formPassword">
                            <Form.Label>비밀번호:</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={password}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            저장
                        </Button>
                        <Button variant="secondary" onClick={toggleEditMode}>
                            취소
                        </Button>
                    </Form>
                )}
            </div>
        </div>
    );
};

export default UserProfileContent;
