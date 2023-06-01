import React, {useEffect, useState} from "react";
import {getUserList} from "services/accountManagementService";
import type {UserInfo} from "components/userInfo";


const AccountManagementContent = () => {
    const [userList, setUserList] = useState<UserInfo[]>([]);

    useEffect(() => {
        const fetchUserList = async () => {
            try {
                const users = await getUserList();
                setUserList(users);
            } catch (error) {
                console.error("Failed to fetch user list:", error);
            }
        };

        fetchUserList();
    }, []);
    return (
        <>
            <div>메인 컨테이너</div>
            <div>AccountManagementContent</div>
            <div>
                {/* userList를 반복하여 각 사용자의 정보를 출력 */}
                {userList.map((user) => (
                    <div key={user.id}>
                        <div>{user.name}</div>
                        <div>{user.email}</div>
                        {/* 추가적인 사용자 정보 출력 */}
                    </div>
                ))}
            </div>
        </>
    );
};

export default AccountManagementContent;