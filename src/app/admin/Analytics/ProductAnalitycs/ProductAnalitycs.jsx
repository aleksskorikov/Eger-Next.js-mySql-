'use client';

import React, { useEffect, useState } from 'react';
import styles from "../ProductsAnalytics/_productsAnalytics.module.scss"

const ProductAnalytics = ({ productId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [analytics, setAnalytics] = useState(null);
    const [error, setError] = useState(null);
    const [data, setData] = useState([]);

        useEffect(() => {
        if (!productId) return;

        const fetchAnalytics = async () => {
        try {
            const response = await fetch(`/api/analytics/${productId}`);
            if (!response.ok) {
            throw new Error(`Ошибка: ${response.status}`);
            }

            const data = await response.json();
            setAnalytics(data);
        } catch (err) {
            setError(err.message);
        }
        };

        fetchAnalytics();
    }, [productId]);

    if (error) return <div style={{ color: 'red' }}>Ошибка аналитики: {error}</div>;
    if (!analytics) return <div>Загрузка аналитики...</div>;

    const { total_quantity, total_revenue, period, sales } = analytics;
    const periodStart = period?.start || 'неизвестно';
    const periodEnd = period?.end || 'неизвестно';

    function handleOpen() {
        setIsOpen(true);
    }

    function handleClose() {
        setIsOpen(false);
        setData([]);
        setError('');
    }
    
    return (
<>

        <button onClick={handleOpen} className={styles.openBtn}>
            Показать аналитику по товару
        </button>
        {isOpen && (
            <div className={styles.modal}>
            <button onClick={handleClose} className={styles.closeBtn}>
                ✖ Закрыть
            </button>
        <div >
        <h4 className={styles.title}>Аналитика продукта</h4>
        <p><b>Общее количество проданных товаров:</b> {total_quantity ?? 0}</p>
        <p><b>Общая сумма продаж:</b> {total_revenue ?? 0} грн</p>
        <p><b>Период:</b> {periodStart} — {periodEnd}</p>
    
        <h5 className={styles.subTitle}>Детали продаж:</h5>
        {sales && sales.length > 0 ? (
            <table className={styles.table}>
            <thead>
                <tr>
                <th>Дата продажи</th>
                <th>Количество</th>
                <th>Цена за единицу (грн)</th>
                <th>Номер заказа</th>
                </tr>
            </thead>
            <tbody>
                {sales.map((sale, index) => (
                <tr key={index}>
                    <td>{sale.date}</td>
                    <td>{sale.quantity}</td>
                    <td>{sale.price}</td>
                    <td>{sale.orderId}</td>
                </tr>
                ))}
            </tbody>
            </table>
        ) : (
            <p>Данных по продажам нет</p>
        )}
                    </div>
                    </div>
                )}
</>

    );
    
};

export default ProductAnalytics;

