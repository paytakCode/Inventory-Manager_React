import axios from 'axios';
import Cookies from 'js-cookie';
import Role from "components/Role";

const getUserList = async () => {
    try {
        const response = await axios.get('http://localhost:9999/api/v1/users', {
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

const updateUserRole = async(userId: number, role:Role) => {
    try {
        const response = await axios.put('http://localhost:9999/api/v1/admin/users/' + userId + "/role", {
            role : role
        }, {
            headers: {
                Authorization: Cookies.get("jwt") as string
            }
        } );
        if (response.status === 204) {
            alert(userId + "의 부서가 " + role + "로 성공적으로 변경되었습니다.");
        }
    } catch (error) {
        alert("부서 변경에 실패하였습니다.");
    }
}

export {getUserList, updateUserRole};
