'use client';

import React, { useEffect, useState } from 'react';
import useAuthUser from '../../../../pages/api/users/useAuthUser';
import styles from './_orders.module.scss';
import FilterOrders from "../CartTab/FilterOrders/FilterOrders";
import Loader from '../../../components/Loader/Loader';

const OrdersTab = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLoaded, setUserLoaded] = useState(false);
  const user = useAuthUser();

  useEffect(() => {
    if (user) {
      setUserLoaded(true);
    }
  }, [user]);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      if (!token || !user?.id) return;

      try {
        const response = await fetch(`/api/orders?user_id=${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setOrders(data.orders);
          setFilteredOrders(data.orders); 
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error('Помилка при завантаженні замовлень:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userLoaded) {
      fetchOrders();
    }
  }, [userLoaded, user]);

  if (loading || !userLoaded) return <Loader/>;

  return (
    <div className={styles.ordersWrapper}>
      <h1 className={styles.title}>Мої замовлення</h1>

      <FilterOrders orders={orders} onFiltered={setFilteredOrders} />

      {filteredOrders.length === 0 ? (
        <p className={styles.empty}>У вас ще немає замовлень за обраний період.</p>
      ) : (
        filteredOrders.map(order => (
          <div key={order.id} className={styles.orderCard}>
            <h3 className={styles.orderNumber}>Замовлення №{order.id}</h3>
            <p className={styles.orderStatus}>
              Статус: {
                order.status === 'pending' ? 'в очікуванні' :
                order.status === 'processing' ? 'в обробці' :
                order.status === 'completed' ? 'завершено' :
                order.status === 'cancelled' ? 'скасовано' :
                order.status
              }
            </p>
            <p className={styles.orderDate}>
              Дата завершення: {new Date(order.created_at).toLocaleDateString()}
            </p>
            <p className={styles.orderTotal}>Сума: {order.total_price} грн</p>

            <h4 className={styles.itemsTitle}>Товари:</h4>
            <div className={styles.itemsWrapper}>
              {order.OrderItems?.map(item => (
                <div key={item.id} className={styles.item}>
                  <p className={styles.productsArticle}>Артикул: # {item.Product.article}</p>
                  <p>Назва: {item.Product?.name || '—'}</p>
                  <p>Кількість: {item.quantity}</p>
                  <p>Ціна: {item.price} грн</p>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrdersTab;
