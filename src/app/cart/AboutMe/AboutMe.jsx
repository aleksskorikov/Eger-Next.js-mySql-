'use client';

import React, { useEffect, useState } from 'react';
import useAuthUser from '../../../../pages/api/users/useAuthUser';
import styles from './_aboutMe.module.scss';
import Loader from '../../../components/Loader/Loader';

const AboutMe = () => {
    const authUser = useAuthUser();
    const [userData, setUserData] = useState(null);
    const [formData, setFormData] = useState({});
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (!authUser?.id) return;

        fetch(`/api/adminUsers?id=${authUser.id}`)
        .then((res) => res.json())
        .then((data) => {
            setUserData(data);
            setFormData(data);
        })
        .catch((err) => console.error('Ошибка загрузки данных:', err));
    }, [authUser?.id]);

    const display = (val) => (val !== null && val !== undefined && val !== '' ? val : '😞');

    const handleChange = (e) => {
        setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
        }));
    };

    const handleSave = async () => {
        try {
        const dataToSend = { ...formData };
        if (!dataToSend.password) {
            delete dataToSend.password;
        }

        const res = await fetch('/api/adminUsers', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSend),
        });
        const updatedUser = await res.json();
        setUserData(updatedUser);
        setIsEditing(false);
        setFormData((prev) => ({ ...prev, password: '' }));
        } catch (err) {
        console.error('Ошибка сохранения:', err);
        }
    };

    if (!authUser) return <div className={styles.loader}>🙅‍♂️ Ви не авторизовані</div>;
    if (!userData) return <Loader/>;

    return (
        <div className={styles.container}>
        <h2 className={styles.heading}>Про мене</h2>

        {!isEditing ? (
            <div className={styles.info}>
            <p><span>Імʼя:</span> {display(userData.first_name)}</p>
            <p><span>По батькові:</span> {display(userData.middle_name)}</p>
            <p><span>Прізвище:</span> {display(userData.last_name)}</p>
            <p><span>Телефон:</span> {display(userData.phone)}</p>
            <p><span>Місто:</span> {display(userData.city)}</p>
            <p><span>Email:</span> {display(userData.email)}</p>
            <p><span>Знижка (%):</span> {display(userData.discount)}</p>
            <p><span>Дата створення:</span> {userData.created_at ? new Date(userData.created_at).toLocaleDateString() : '😞'}</p>

            <button className={styles.editButton} onClick={() => setIsEditing(true)}>
                ✏️ Змінити
            </button>
            </div>
        ) : (
            <div className={styles.form}>
            <input
                type="text"
                name="first_name"
                placeholder="Імʼя"
                value={formData.first_name || ''}
                onChange={handleChange}
            />
            <input
                type="text"
                name="middle_name"
                placeholder="По батькові"
                value={formData.middle_name || ''}
                onChange={handleChange}
            />
            <input
                type="text"
                name="last_name"
                placeholder="Прізвище"
                value={formData.last_name || ''}
                onChange={handleChange}
            />
            <input
                type="text"
                name="phone"
                placeholder="Телефон"
                value={formData.phone || ''}
                onChange={handleChange}
            />
            <input
                type="text"
                name="city"
                placeholder="Місто"
                value={formData.city || ''}
                onChange={handleChange}
            />
            <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email || ''}
                onChange={handleChange}
            />
            <input
                type="password"
                name="password"
                placeholder="Новий пароль (залиште порожнім, щоб не змінювати)"
                value={formData.password || ''}
                onChange={handleChange}
                autoComplete="new-password"
            />

            <div className={styles.buttonGroup}>
                <button className={styles.saveButton} onClick={handleSave}>💾 Зберегти</button>
                <button className={styles.cancelButton} onClick={() => setIsEditing(false)}>❌ Скасувати</button>
            </div>
            </div>
        )}
        </div>
    );
};

export default AboutMe;



