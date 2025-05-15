'use client';

import { useState } from 'react';
import styles from '../../Managers/AddManagersForm/_managersForm.module.scss';

const UserEditForm = ({ user, onSave, onCancel }) => {
    const [formData, setFormData] = useState({ ...user });
    const [saving, setSaving] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
        const response = await fetch('/api/adminUsers', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error('Помилка при оновленні користувача');
        const updatedUser = await response.json();
        onSave(updatedUser); // Повертаємо оновлені дані в AdminUsers
        } catch (err) {
        alert(err.message);
        } finally {
        setSaving(false);
        }
    };

    return (
        <form className={styles.editForm} onSubmit={handleSubmit}>
        <h2>Редагування користувача</h2>
        <input name="first_name" value={formData.first_name || ''} onChange={handleChange} placeholder="Ім'я" />
        <input name="last_name" value={formData.last_name || ''} onChange={handleChange} placeholder="Прізвище" />
        <input name="phone" value={formData.phone || ''} onChange={handleChange} placeholder="Телефон" />
        <input name="city" value={formData.city || ''} onChange={handleChange} placeholder="Місто" />
        <select name="role" value={formData.role} onChange={handleChange}>
            <option value="client">Клієнт</option>
            <option value="manager">Менеджер</option>
            <option value="admin">Адмін</option>
        </select>
        <div>
            <button type="submit" disabled={saving}>💾 Зберегти</button>
            <button type="button" onClick={onCancel}>Скасувати</button>
        </div>
        </form>
    );
};

export default UserEditForm;
