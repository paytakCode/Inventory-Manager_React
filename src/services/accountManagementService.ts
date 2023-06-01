import axios from 'axios';
import Cookies from 'js-cookie';

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
        alert('Load UserList Failed');
    }
}

export {getUserList};
