'use client';

import { useState, useEffect } from 'react';
import styles from "./_users.module.scss";
import UserEditForm from './UsersComponents/UserEditForm';

const AdminUsers = ({ onSelectUser }) => {
    const [userList, setUserList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    const handleRowClick = (user) => {
    setSelectedUser(user);
    };

    const handleCancelEdit = () => {
    setSelectedUser(null);
    };

    const handleSaveEdit = (updatedUser) => {
    setUserList((prev) =>
        prev.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
    setSelectedUser(null);
    };


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('/api/adminUsers');
                if (!response.ok) throw new Error('Не вдалося отримати дані');
                const data = await response.json();
                setUserList(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    // const handleRowClick = (user) => {
    //     onSelectUser(user); 
    // };

    const handleDelete = async (id) => {
        if (!confirm("Ви впевнені, що хочете видалити цього користувача?")) return;

        try {
            const response = await fetch(`/api/adminUsers?id=${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Помилка при видаленні');
            setUserList(prev => prev.filter(user => user.id !== id));
        } catch (error) {
            alert(error.message);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className={styles.listBlock}>
            <h1 className={styles.title}>Сотрудники компанії</h1>
            
            {selectedUser && (
                <UserEditForm
                    user={selectedUser}
                    onSave={handleSaveEdit}
                    onCancel={handleCancelEdit}
                />
                )}

            <table className={styles.listTable}>
                <thead>
                    <tr>
                        <th>ID</th><th>Ім'я</th><th>Прізвище</th><th>Телефон</th><th>Місто</th><th>Роль</th><th>Дії</th>
                    </tr>
                </thead>
                <tbody>
                    {userList.length > 0 ? (
                        userList.map((user) => (
                            <tr key={user.id} onClick={() => handleRowClick(user)}>
                                <td>{user.id}</td>
                                <td>{user.first_name}</td>
                                <td>{user.last_name}</td>
                                <td>{user.phone}</td>
                                <td>{user.city}</td>
                                <td>{user.role}</td>
                                <td>
                                    <button onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(user.id);
                                    }}>🗑️</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="7">Користувачі не знайдені</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AdminUsers;
