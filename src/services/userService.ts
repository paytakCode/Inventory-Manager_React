import axios from 'axios';
import Cookies from 'js-cookie';
import Role from "components/Base/Role";
import {UserInfoDto} from "../components/Base/UserInfoDto";
import {UserDto} from "../components/Base/UserDto";


const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const addUser = async (userDto: UserDto) => {
    try {
        const response = await axios.post(API_BASE_URL + '/users', userDto);
        if (response.status === 201) {
            alert(userDto.name + '이 등록되었습니다.');
        } else {
            throw new Error('등록에 실패하였습니다.');
        }
    } catch (error) {
        alert('이미 등록된 이메일입니다.');
        throw error;
    }
};


export const getUserList = async () => {
    try {
        const response = await axios.get(API_BASE_URL + '/users', {
            headers: {
                Authorization: Cookies.get("jwt") as string
            }
        });
        if (response.status === 200) {
            const userList = response.data;
            return userList;
        }
    } catch (error) {
        alert('Load UserList Failed' + error);
    }
}

export const updateUserRole = async (userId: number, role: Role) => {
    try {
        const response = await axios.put(API_BASE_URL + '/admin/users/' + userId + "/role", {
            role: role
        }, {
            headers: {
                Authorization: Cookies.get("jwt") as string
            }
        });
        if (response.status === 204) {
            alert(userId + "의 부서가 " + role + "로 성공적으로 변경되었습니다.");
        }
    } catch (error) {
        alert("부서 변경에 실패하였습니다.");
    }
}

export const getCurrentUserInfo = () => {
    const storedUserInfo = Cookies.get('userInfo');
    if (storedUserInfo) {
        const parsedUserInfo: UserInfoDto = JSON.parse(storedUserInfo);
        return parsedUserInfo;
    }

    return {} as UserInfoDto;
}

export const updateUser = async (user: UserDto) => {
    try {
        const response = await axios.put(API_BASE_URL + '/users/' + user.id,
            user, {
                headers: {
                    Authorization: Cookies.get("jwt") as string
                }
            });
        if (response.status === 204) {
            alert(user.name + "의 정보가 성공적으로 변경되었습니다.");
        }
    } catch (error) {
        alert("정보 변경에 실패하였습니다.");
    }
}

