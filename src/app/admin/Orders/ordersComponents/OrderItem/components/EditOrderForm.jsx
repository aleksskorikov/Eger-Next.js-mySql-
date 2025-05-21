
import { useState } from 'react';
import styles from './_editOrderForm.module.scss';

const EditOrderForm = ({ order, onCancel, onSave }) => {
    const [formData, setFormData] = useState({
        surname: order.surname || '',
        name: order.name || '',
        patronymic: order.patronymic || '',
        phone: order.phone || '',
        delivery_method: order.delivery_method || '',
        department: order.department || '',
        address: order.address || '',
        city: order.city || '',
        region: order.region || '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/orders/${order.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });
    
            if (!res.ok) throw new Error('Помилка оновлення замовлення');
            const updated = await res.json();
            console.log('Server response:', updated);
            onSave(updated); 
        } catch (err) {
            console.error(err);
            alert('Не вдалося зберегти зміни');
        }
    };
    return (
        <div className={styles.editForm}>
        <h4 className={styles.sectionTitle}>Редагування замовлення</h4>

        <label>
            ПІБ:
            <input name="surname" value={formData.surname} onChange={handleInputChange} placeholder="Прізвище" />
            <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Ім’я" />
            <input name="patronymic" value={formData.patronymic} onChange={handleInputChange} placeholder="По батькові" />
        </label>

        <label>
            Телефон:
            <input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Телефон" />
        </label>

        <label>
            Метод доставки:
            <select name="delivery_method" value={formData.delivery_method} onChange={handleInputChange}>
            <option value="">Оберіть</option>
            <option value="Нова Пошта">Нова Пошта</option>
            <option value="Укрпошта">Укрпошта</option>
            <option value="Кур’єр">Кур’єр</option>
            </select>
        </label>

        <label>
            Відділення:
            <input name="department" value={formData.department} onChange={handleInputChange} placeholder="№ відділення" />
        </label>

        <label>
            Адреса:
            <input name="address" value={formData.address} onChange={handleInputChange} placeholder="Адреса" />
            <input name="city" value={formData.city} onChange={handleInputChange} placeholder="Місто" />
            <input name="region" value={formData.region} onChange={handleInputChange} placeholder="Область" />
        </label>

        <div className={styles.buttonGroup}>
            <button onClick={handleSubmit} className={styles.saveButton}>Зберегти</button>
            <button onClick={onCancel} className={styles.cancelButton}>Скасувати</button>
        </div>
        </div>
    );
};

export default EditOrderForm;
