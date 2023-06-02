import React, { useEffect, useState } from "react";
import { getUserList, updateUserRole } from "services/accountManagementService";
import type { UserInfo } from "components/userInfo";
import Role from "components/Role";

const AccountManagementContent = () => {
    const [userList, setUserList] = useState<UserInfo[]>([]);

    useEffect(() => {
        const fetchUserList = async () => {
            try {
                const gotUserList = await getUserList();
                setUserList(gotUserList);
            } catch (error) {
                console.error("Failed to fetch user list:", error);
            }
        };

        fetchUserList();
    }, []);

    const handleRoleChange = async (userId: number, newRole: Role) => {
        try {
            await updateUserRole(userId, newRole);
            setUserList((prevUserList) =>
                prevUserList.map((user) =>
                    user.id === userId ? { ...user, role: newRole } : user
                )
            );
        } catch (error) {
            console.error("Failed to update user role:", error);
        }
    };

    const filteredUserList = userList.filter((user) => user.role !== Role.Admin);

    return (
        <>
            <div>메인 컨테이너</div>
            <div>AccountManagementContent</div>
            <div>
                <table>
                    <thead>
                    <tr>
                        <th>이름</th>
                        <th>Email</th>
                        <th>부서</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredUserList.map((user) => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                                <select
                                    value={user.role}
                                    onChange={(e) =>
                                        handleRoleChange(user.id, e.target.value as Role)
                                    }
                                >
                                    {Object.values(Role).map((role) => (
                                        <option key={role} value={role}>
                                            {role}
                                        </option>
                                    ))}
                                </select>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default AccountManagementContent;
