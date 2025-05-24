'use client';
import React, { useEffect, useState } from 'react';
import styles from './_completedOrders.module.scss';
import OrderPeriodFilter from '../OrderPeriodFilter/OrderPeriodFilter';

const CompletedOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filteredOrders, setFilteredOrders] = useState([]);

    useEffect(() => {
        
        const fetchOrders = async () => {
            try {
                const response = await fetch('/api/completed-orders?type=completed', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    },
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setOrders(data.orders || []);
            } catch (err) {
                console.error('Fetch error:', err);
                setError(err.message || 'Помилка при завантаженні даних');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);
    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>Завантаження даних...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorContainer}>
                <h3>Помилка</h3>
                <p>{error}</p>
                <button 
                    onClick={() => window.location.reload()}
                    className={styles.refreshButton}
                >
                    Спробувати ще раз
                </button>
            </div>
        );
    }

    if (!orders.length) {
        return (
            <div className={styles.noOrders}>
                <img src="/images/no-orders.svg" alt="Немає замовлень" />
                <h3>Немає завершених замовлень</h3>
                <p>Тут будуть відображатися ваші завершені замовлення</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Завершені замовлення</h1>
                <div className={styles.summary}>
                    <span>Всього замовлень: {filteredOrders.length}</span>
                    <span>Загальна сума: {filteredOrders.reduce((sum, order) => sum + order.total_price, 0)} грн</span>
                </div>
            </div>

            <div className={styles.ordersList}>
                <OrderPeriodFilter
                    orders={orders}
                    onFiltered={setFilteredOrders}
                />
                {filteredOrders.map((order) => (
                    <div key={order.id} className={styles.orderCard}>
                        <div className={styles.orderHeader}>
                            <div>
                                <h3>Замовлення #{order.id}</h3>
                                <h4>Замовлення клієнта #{order.order_id}</h4>
                                <p className={styles.date}>
                                    Завершено: {new Date(order.completed_at).toLocaleString()}
                                </p>
                            </div>
                            <div className={styles.orderTotal}>
                                <span>Сума:</span>
                                <strong>{order.total_price} грн</strong>
                            </div>
                        </div>

                        <div className={styles.orderDetails}>
                            <div className={styles.customerInfo}>
                                <h4>Клієнт</h4>
                                {order.user ? (
                                    <>
                                        <p><strong>{order.user.full_name}</strong></p>
                                        <p>Телефон: {order.user.phone}</p>
                                        <p>Email: {order.user.email}</p>
                                        <p>Місто: {order.user.city}</p>
                                    </>
                                ) : (
                                    <p>Інформація про клієнта відсутня</p>
                                )}
                            </div>

                            <div className={styles.shippingInfo}>
                                <h4>Доставка</h4>
                                {order.shipping_address ? (
                                    <>
                                        <p><strong>Прізвище:</strong> {order.shipping_address.surname || '-'}</p>
                                        <p><strong>Ім'я:</strong> {order.shipping_address.name || '-'}</p>
                                        <p><strong>По батькові:</strong> {order.shipping_address.patronymic || '-'}</p>
                                        <p><strong>Область:</strong> {order.shipping_address.region || '-'}</p>
                                        <p><strong>Місто:</strong> {order.shipping_address.city || '-'}</p>
                                        <p><strong>Телефон:</strong> {order.shipping_address.phone || '-'}</p>
                                        <p><strong>Вулиця, будинок:</strong> {order.shipping_address.address || '-'}</p>
                                        <p><strong>Відділення:</strong> {order.shipping_address.department || '-'}</p>
                                        <p><strong>Спосіб доставки:</strong> {order.shipping_address.delivery_method || '-'}</p>
                                    </>
                                ) : (
                                    <p>Інформація про доставку відсутня</p>
                                )}
                            </div>
                        </div>

                        <div className={styles.productsSection}>
                            <h4>Товари</h4>
                            <table className={styles.itemsTable}>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Назва</th>
                                        <th>Кількість</th>
                                        <th>Ціна</th>
                                        <th>Сума</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.items?.length > 0 ? (
                                        order.items.map((item) => (
                                            <tr key={`${order.id}-${item.id}`}>
                                                <td>{item.id}</td>
                                                <td>{item.product_name}</td>
                                                <td>{item.quantity}</td>
                                                <td>{item.price} грн</td>
                                                <td>{(item.price * item.quantity).toFixed(2)} грн</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5">Немає інформації про товари</td>
                                        </tr>
                                    )}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan="4" className={styles.totalLabel}>Всього:</td>
                                        <td className={styles.totalValue}>{order.total_price} грн</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        {order.staff && (
                            <div className={styles.staffInfo}>
                                <p><strong>Виконавець замовлення:</strong> {order.staff.full_name}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CompletedOrders;
