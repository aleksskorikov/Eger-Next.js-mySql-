'use client';

import { useState, useEffect } from 'react';
import styles from "./_ordersForm.module.scss";

const OrderForm = ({ onSubmit, cartItems }) => {
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        patronymic: '',
        region: '',
        city: '',
        phone: '',
        address: '',
        deliveryMethod: '',
        department: '',
        departmentCustom: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (cartItems.length === 0) {
            alert('Корзина пуста! Пожалуйста, добавьте товары перед оформлением заказа.');
            return;
        }

        const finalData = {
            ...formData,
            department: formData.department === 'other' ? formData.departmentCustom : formData.department,
        };

        delete finalData.departmentCustom;
        console.log('Данные для отправки заказа:', {
            ...finalData,
            cartItems,
        });

        const token = localStorage.getItem('token');

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...finalData,
                    cartItems,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                onSubmit?.(result.orderId);
            } else {
                alert(result.error || 'Помилка при збереженні замовлення');
            }
        } catch (error) {
            console.error('Ошибка при оформлении заказа:', error);
            alert('Щось пішло не так при оформленні замовлення');
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <h3 className={styles.title}>Форма замовлення</h3>

            <input
                className={styles.input}
                type="text"
                name="surname"
                placeholder="Прізвище"
                value={formData.surname}
                onChange={handleChange}
                required
            />
            <input
                className={styles.input}
                type="text"
                name="name"
                placeholder="Ім'я"
                value={formData.name}
                onChange={handleChange}
                required
            />
            <input
                className={styles.input}
                type="text"
                name="patronymic"
                placeholder="По батькові"
                value={formData.patronymic}
                onChange={handleChange}
                required
            />
            <input
                className={styles.input}
                type="text"
                name="region"
                placeholder="Область"
                value={formData.region}
                onChange={handleChange}
                required
            />
            <input
                className={styles.input}
                type="text"
                name="city"
                placeholder="Населений пункт"
                value={formData.city}
                onChange={handleChange}
                required
            />
            <input
                className={styles.input}
                type="tel"
                name="phone"
                placeholder="Телефон"
                value={formData.phone}
                onChange={handleChange}
                required
            />
            <input
                className={styles.input}
                type="text"
                name="address"
                placeholder="Вулиця, будинок"
                value={formData.address}
                onChange={handleChange}
                required
            />

            <select
                className={styles.select}
                name="deliveryMethod"
                value={formData.deliveryMethod}
                onChange={handleChange}
                required
            >
                <option value="">Оберіть спосіб доставки</option>
                <option value="Нова Пошта">Нова Пошта</option>
                <option value="Укрпошта">Укрпошта</option>
            </select>

            <select
                className={styles.select}
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
            >
                <option value="">Оберіть відділення</option>
                <option value="Відділення №1">Відділення №1</option>
                <option value="Відділення №2">Відділення №2</option>
                <option value="Відділення №3">Відділення №3</option>
                <option value="other">Інше (введіть своє)</option>
            </select>

            {formData.department === 'other' && (
                <input
                    className={styles.input}
                    type="text"
                    name="departmentCustom"
                    placeholder="Введіть відділення або індекс"
                    value={formData.departmentCustom}
                    onChange={handleChange}
                    required
                />
            )}

            <button type="submit" className={styles.submitButton}>
                Підтвердити замовлення
            </button>
        </form>
    );
};

export default OrderForm;
