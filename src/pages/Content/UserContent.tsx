import React, { useEffect, useState } from "react";
import { getUserList, updateUserRole } from "services/userService";
import type { UserInfoDto } from "components/Base/UserInfoDto";
import Role from "components/Base/Role";

const UserContent = () => {
    const [userList, setUserList] = useState<UserInfoDto[]>([]);

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
                prevUserList.map((user) => (user.id === userId ? { ...user, role: newRole } : user))
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
                        <UserRow
                            key={user.id}
                            user={user}
                            handleRoleChange={handleRoleChange}
                        />
                    ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

type UserRowProps = {
    user: UserInfoDto;
    handleRoleChange: (userId: number, newRole: Role) => Promise<void>;
};

const UserRow: React.FC<UserRowProps> = ({ user, handleRoleChange }) => {
    return (
        <tr>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>
                <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id || 0, e.target.value as Role)}
                >
                    {Object.values(Role).map((role) => (
                        <option key={role} value={role}>
                            {role}
                        </option>
                    ))}
                </select>
            </td>
        </tr>
    );
};

export default UserContent;
