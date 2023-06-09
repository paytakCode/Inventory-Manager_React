import React, {useEffect, useState} from "react";
import {getUserList, updateUserRole} from "services/userService";
import type {UserInfoDto} from "components/Base/UserInfoDto";
import Role from "components/Base/Role";
import {Table} from "react-bootstrap";
import styles from "pages/Content/CommonContent.module.scss";

const AccountManagementContent = () => {
    const [userList, setUserList] = useState<UserInfoDto[]>([]);
    const [sortBy, setSortBy] = useState<string | undefined>(undefined);
    const [sortDirection, setSortDirection] = useState<string>("asc");
    const [searchKeyword, setSearchKeyword] = useState("");
    const [searchOption, setSearchOption] = useState("");

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
    const sortUserList = (list: UserInfoDto[]) => {
        const sortedList = [...list].sort((a, b) => {
            if (sortBy === "name") {
                return a.name.localeCompare(b.name);
            } else if (sortBy === "email") {
                return a.email.localeCompare(b.email);
            } else if (sortBy === "role") {
                return a.role.localeCompare(b.role);
            } else {
                return 0;
            }
        });

        return sortDirection === "desc" ? sortedList.reverse() : sortedList;
    };


    const handleSort = (column: string) => {
        setSearchKeyword("");
        if (column === sortBy) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortBy(column);
            setSortDirection("asc");
        }
    };


    const handleRoleChange = async (userId: number, newRole: Role) => {
        try {
            await updateUserRole(userId, newRole);
            setUserList((prevUserList) =>
                prevUserList.map((user) => (user.id === userId ? {...user, role: newRole} : user))
            );
        } catch (error) {
            console.error("Failed to update user role:", error);
        }
    };

    const filteredUserList = userList.filter((user) => user.role !== Role.Admin);

    return (
        <div className={styles.content}>
            <div className={styles.title}>관리자 - 직원 관리</div>
            <div className={styles.searchContainer}>
                <div className={styles.addButton}></div>
                <select
                    value={searchOption}
                    onChange={(e) => setSearchOption(e.target.value)}
                >
                    <option value="" disabled={true}>
                        검색 옵션
                    </option>
                    <option value="name">이름</option>
                    <option value="email">Email</option>
                </select>
                <input
                    type="text"
                    value={searchKeyword}
                    placeholder="검색어를 입력하세요"
                    onChange={(e) => setSearchKeyword(e.target.value)}
                />
                <button onClick={() => setSearchKeyword("")}>초기화</button>
            </div>
            <div className={styles.tableContainer}>
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th onClick={() => handleSort("name")}>
                            이름{" "}
                            {sortBy === "name" && sortDirection === "asc" && <span>&uarr;</span>}
                            {sortBy === "name" && sortDirection === "desc" && <span>&darr;</span>}
                        </th>
                        <th onClick={() => handleSort("email")}>
                            Email{" "}
                            {sortBy === "email" && sortDirection === "asc" && <span>&uarr;</span>}
                            {sortBy === "email" && sortDirection === "desc" && <span>&darr;</span>}
                        </th>
                        <th onClick={() => handleSort("role")}>
                            부서{" "}
                            {sortBy === "role" && sortDirection === "asc" && <span>&uarr;</span>}
                            {sortBy === "role" && sortDirection === "desc" && <span>&darr;</span>}
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {sortUserList(filteredUserList)
                        .filter((user) => {
                            if (searchOption === "name") {
                                return user.name.toLowerCase().includes(searchKeyword.toLowerCase());
                            } else if (searchOption === "email") {
                                return user.email.toLowerCase().includes(searchKeyword.toLowerCase());
                            } else {
                                return true;
                            }
                        })
                        .map((user) => (
                            <UserRow
                                key={user.id}
                                user={user}
                                handleRoleChange={handleRoleChange}
                            />
                        ))}
                    </tbody>
                </Table>
            </div>
        </div>
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

export default AccountManagementContent;
