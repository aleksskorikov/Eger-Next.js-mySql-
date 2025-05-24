'use client';

import React, { useEffect, useState } from 'react';
import styles from "../ProductsAnalytics/_productsAnalytics.module.scss";
import DateRangeSelector from '../../Managers/DateRangeSelector/DateRangeSelector'; 
import {LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const ProductAnalytics = ({ productId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [analytics, setAnalytics] = useState(null);
    const [error, setError] = useState(null);
    const [dateRange, setDateRange] = useState({ from: null, to: null });

    const fetchAnalytics = async () => {
        if (!productId) return;

        try {
        const params = new URLSearchParams();

        if (dateRange.from) params.append('from', dateRange.from.toISOString());
        if (dateRange.to) params.append('to', dateRange.to.toISOString());

        const response = await fetch(`/api/analytics/${productId}?${params.toString()}`);
        if (!response.ok) throw new Error(`Ошибка: ${response.status}`);

        const data = await response.json();
        setAnalytics(data);
        } catch (err) {
        setError(err.message);
        }
    };

    useEffect(() => {
        if (isOpen) fetchAnalytics();
    }, [productId, dateRange, isOpen]);

    const handleOpen = () => {
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
        setAnalytics(null);
        setError(null);
    };

    if (error) return <div style={{ color: 'red' }}>Ошибка аналитики: {error}</div>;

    const { total_quantity, total_revenue, period, sales = [] } = analytics || {};
    const periodStart = period?.start || 'невідомо';
    const periodEnd = period?.end || 'невідомо';
    const groupedByPrice = sales.reduce((acc, sale) => {
        const key = sale.price;
        if (!acc[key]) {
        acc[key] = {
            price: sale.price,
            quantity: 0,
            total: 0,
            orders: [],
        };
        }
        acc[key].quantity += sale.quantity;
        acc[key].total += sale.price * sale.quantity;
        acc[key].orders.push(sale);
        return acc;
    }, {});
    const groupedArray = Object.values(groupedByPrice);

    const salesChartData = sales.reduce((acc, sale) => {
        const existing = acc.find(item => item.date === sale.date);
        if (existing) {
            existing.revenue += sale.price * sale.quantity;
            existing.quantity += sale.quantity;
        } else {
            acc.push({
                date: sale.date,
                revenue: sale.price * sale.quantity,
                quantity: sale.quantity,
            });
        }
        return acc;
    }, []);


    return (
        <>
        <button onClick={handleOpen} className={styles.openBtn}>
            Показати аналітику з товару
        </button>

        {isOpen && (
            <div className={styles.modal}>
            <button onClick={handleClose} className={styles.closeBtn}>✖ Закрити</button>
            <h4 className={styles.title}>Аналітика продукту</h4>
            <div className={styles.rengeBlock}>
                <DateRangeSelector onFilterChange={setDateRange} />        
            </div>
            

            {!analytics ? (
                <p>Загрузка аналитики...</p>
            ) : (
                <>
                <p className={styles.totalDescription}>Загальна кількість проданих товарів: <span>{total_quantity ?? 0}</span></p>
                <p className={styles.totalDescription}>Загальна сума продажу: <span>{total_revenue?.toFixed(2) ?? 0}</span> грн</p>
                <p className={styles.totalDescription}>Період: <span>{periodStart} — {periodEnd}</span></p>

                <h5 className={styles.subTitle}>Продажі</h5>
                {groupedArray.length > 0 ? (
                    groupedArray.map((group, idx) => (
                    <div key={idx} className={styles.priceGroup}>
                        <h6 className={styles.totalDescription}>Ціна: <span>{group.price}</span> грн</h6>
                        <p className={styles.totalDescription}>Продано: <span>{group.quantity}</span> шт</p>
                        <p className={styles.totalDescription}>Сума: <span>{group.total.toFixed(2)}</span> грн</p>
                        <table className={styles.table}>
                        <thead>
                            <tr>
                            <th>Дата</th>
                            <th>Количество</th>
                            <th>Цена</th>
                            <th>Номер заказа</th>
                            </tr>
                        </thead>
                        <tbody>
                            {group.orders.map((sale, index) => (
                            <tr key={index}>
                                <td>{sale.date}</td>
                                <td>{sale.quantity}</td>
                                <td>{sale.price}</td>
                                <td>{sale.orderId}</td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>
                    ))
                ) : (
                    <p>Данных по продажам нет</p>
                )}
                </>
            )}
                
                
                    <h5 className={styles.subTitle}>График выручки по дням:</h5>
                    <div className={styles.responsiveContainer}>
                        {salesChartData.length > 0 ? (
                        <ResponsiveContainer >
                            <LineChart data={salesChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Выручка (грн)" />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <p>Нет данных для отображения графика</p>
                    )}
                    </div>
                
                    
            </div>
        )}
        </>
    );
};

export default ProductAnalytics;
