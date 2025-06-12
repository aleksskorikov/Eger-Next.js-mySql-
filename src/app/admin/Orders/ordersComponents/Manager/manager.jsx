'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../../components/users/authContext';
import OrderItem from '../OrderItem/OrderItem';
import CompletedOrders from '../CompletedOrders/completedOrders.jsx';
import styles from './_managers.module.scss';

const ManagerPage = () => {
  const { user, logout } = useAuth();
  const [activeTab, setTab] = useState('processing');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getToken = () => {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem('token');
    if (!token) {
      logout();
      window.location.href = '/login';
      throw new Error('Authentication required');
    }
    return token;
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const token = getToken();
      const res = await fetch(`/api/orders/manager-orders?type=${activeTab}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(`Ошибка: ${res.status}`);

      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Не удалось загрузить заказы');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (getToken()) {
      fetchOrders();
    }
  }, [activeTab, user]);

  const handleComplete = (orderId) => {
    setOrders(prev => prev.filter(order => order.id !== orderId));
  };

  const handleCancel = (orderId) => {
    setOrders(prev => prev.filter(order => order.id !== orderId));
  };

  if (!user) {
    return <div>Загрузка данных пользователя...</div>;
  }

  const handleUpdateOrder = (updatedOrder) => {  
    const actualUpdatedOrder = updatedOrder.order || updatedOrder;
    
    setOrders(prev => prev.map(order => 
        order.id === actualUpdatedOrder.id 
            ? { ...order, ...actualUpdatedOrder } 
            : order
    ));
};
  
  

  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabHeaders}>
        <button
          onClick={() => setTab('processing')}
          className={`${styles.tabButton} ${activeTab === 'processing' ? styles.active : ''}`}
        >
          В работе
        </button>
        <button
          onClick={() => setTab('completed')}
          className={`${styles.tabButton} ${activeTab === 'completed' ? styles.active : ''}`}
        >
          Завершенные
        </button>
      </div>

      {loading && <p>Загрузка...</p>}
      {error && <p className={styles.error}>Ошибка: {error}</p>}

      {!loading && !error && (
        <>
          {activeTab === 'processing' && (
            <div className={styles.ordersList}>
              {orders.map(order => (
                <OrderItem
                  key={order.id}
                  order={order}
                  onCancel={handleCancel}
                  onComplete={handleComplete}
                  onUpdateOrder={handleUpdateOrder}
                />
              ))}
            </div>
          )}
          {activeTab === 'completed' && (
            <CompletedOrders
              orders={orders}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ManagerPage;
