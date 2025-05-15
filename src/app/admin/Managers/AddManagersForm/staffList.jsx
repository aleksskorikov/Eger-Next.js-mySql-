'use client';
import { useState, useEffect } from 'react';
import styles from "./_staffaalist.module.scss";

const StaffList = ({ onSelectStaff }) => {
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStaffData = async () => {
            try {
                const response = await fetch('/api/staff');
                if (!response.ok) {
                    throw new Error('Failed to fetch staff data');
                }
                const data = await response.json();
                setStaffList(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStaffData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const handleRowClick = (staff) => {
        onSelectStaff(staff);
    };

    return (
        <div className={styles.listBlock}>
            <h1 className={styles.title}>Сотрудники компании</h1>
            <table className={styles.listTable}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Ім'я</th>
                        <th>Прізвище</th>
                        <th>По-батькові</th>
                        <th>Дата народження</th>
                        <th>Паспорт(серія та номер)</th>
                        <th>Паспорт(ким виданий)</th>
                        <th>Паспорт(коли виданий)</th>
                        <th>ІПН</th>
                        <th>Прийнятий на роботу</th> 
                        <th>Звільнений</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {staffList.length > 0 ? (
                        staffList.map((staff) => (
                            <tr key={staff.id} onClick={() => handleRowClick(staff)}>
                                <td>{staff.id}</td>
                                <td>{staff.first_name}</td>
                                <td>{staff.last_name}</td>
                                <td>{staff.middle_name}</td>
                                <td>{staff.birth_date}</td>
                                <td>{staff.passport_series}</td>
                                <td>{staff.passport_issued_by}</td>
                                <td>{staff.passport_issued_date}</td>
                                <td>{staff.identification_code}</td>
                                <td>{staff.employment_date}</td>
                                <td>{staff.dismissal_date}</td>
                                <td>{staff.role}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="9">No staff found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default StaffList;
