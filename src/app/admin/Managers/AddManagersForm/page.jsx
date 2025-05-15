'use client';

import { useState, useEffect } from 'react';
import styles from "./_managersForm.module.scss";

const initialEmptyState = {
    first_name: '',
    last_name: '',
    middle_name: '',
    birth_date: '',
    passport_series: '',
    passport_issued_by: '',
    passport_issued_date: '',
    identification_code: '',
    employment_date: '',
    dismissal_date: '',
    role: 'manager',
    email: '',
    password: '',
};

const StaffForm = ({ staffData = null, onSubmit }) => {
    const [staff, setStaff] = useState(initialEmptyState);

    useEffect(() => {
        if (staffData) {
            const nameParts = staffData.full_name ? staffData.full_name.split(' ') : [];
            
            const formatDate = (dateString) => {
                if (!dateString) return '';
                const date = new Date(dateString);
                return date.toISOString().split('T')[0];
            };

            setStaff({
                first_name: staffData.first_name || '',
                last_name: staffData.last_name || '',
                middle_name: staffData.middle_name || '',
                birth_date: formatDate(staffData.birth_date),
                passport_series: staffData.passport_series || '',
                passport_issued_by: staffData.passport_issued_by || '',
                passport_issued_date: formatDate(staffData.passport_issued_date),
                identification_code: staffData.identification_code || '',
                employment_date: formatDate(staffData.employment_date),
                dismissal_date: formatDate(staffData.dismissal_date),
                role: staffData.role || 'manager',
                email: staffData.email || '',
                password: '',
            });
        } else {
            setStaff(initialEmptyState);
        }
    }, [staffData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStaff(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            ...staff,
            full_name: `${staff.first_name} ${staff.last_name} ${staff.middle_name}`.trim(),
            birth_date: staff.birth_date || null,
            passport_issued_date: staff.passport_issued_date || null,
            employment_date: staff.employment_date || null,
            dismissal_date: staff.dismissal_date || null,
        };

        if (staffData?.id && !staff.password) {
            delete payload.password;
        }

        try {
            const method = staffData?.id ? 'PUT' : 'POST';
            const url = staffData?.id ? `/api/staff/${staffData.id}` : '/api/staff';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Ошибка сервера');
            }

            const result = await res.json();
            onSubmit?.(result);
            if (!staffData?.id) setStaff(initialEmptyState);
        } catch (error) {
            console.error('Ошибка при сохранении:', error);
            alert('Произошла ошибка: ' + error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.formContainer}>
            <div>
                <label>Ім'я:</label>
                <input type="text" name="first_name" value={staff.first_name} onChange={handleChange} required />
            </div>
            <div>
                <label>Прізвище:</label>
                <input type="text" name="last_name" value={staff.last_name} onChange={handleChange} required />
            </div>
            <div>
                <label>По-батькові:</label>
                <input type="text" name="middle_name" value={staff.middle_name} onChange={handleChange} />
            </div>
            <div>
                <label>Дата народження:</label>
                <input type="date" name="birth_date" value={staff.birth_date} onChange={handleChange} />
            </div>
            <div>
                <label>Паспорт (серія та номер):</label>
                <input type="text" name="passport_series" value={staff.passport_series} onChange={handleChange} />
            </div>
            <div>
                <label>Паспорт (ким виданий):</label>
                <input type="text" name="passport_issued_by" value={staff.passport_issued_by} onChange={handleChange} />
            </div>
            <div>
                <label>Паспорт (коли виданий):</label>
                <input type="date" name="passport_issued_date" value={staff.passport_issued_date} onChange={handleChange} />
            </div>
            <div>
                <label>ІПН:</label>
                <input type="text" name="identification_code" value={staff.identification_code} onChange={handleChange} />
            </div>
            <div>
                <label>Прийнятий на роботу:</label>
                <input type="date" name="employment_date" value={staff.employment_date} onChange={handleChange} />
            </div>
            <div>
                <label>Звільнений:</label>
                <input type="date" name="dismissal_date" value={staff.dismissal_date} onChange={handleChange} />
            </div>
            <div>
                <label>Роль:</label>
                <select name="role" value={staff.role} onChange={handleChange} required>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                </select>
            </div>
            <div>
                <label>Email:</label>
                <input type="email" name="email" value={staff.email} onChange={handleChange} required /></div>
            <div>
                <label>Пароль:</label>
                <input 
                    type="password" 
                    name="password" 
                    value={staff.password} 
                    onChange={handleChange} 
                    required={!staffData?.id}
                    placeholder={staffData?.id ? "Оставьте пустым, если не изменять" : ""}
                />
            </div>
            <button type="submit">{staffData?.id ? 'Оновити' : 'Додати'} співробітника</button>
        </form>
    );
};

export default StaffForm;