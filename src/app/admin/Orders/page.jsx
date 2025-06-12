"use client"; 

import React, { useEffect, useState } from 'react';
import styles from "./_orders.module.scss";
import NewOrders from "./ordersComponents/NewOrders/newOrders.jsx";
import Manager from "./ordersComponents/Manager/manager.jsx";
import { useAuth } from '../../../components/users/authContext.js';
import { useRouter } from 'next/navigation';

const Orders = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('new');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getToken = () => {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem('token');
    if (!token) {
      logout();
      router.push('/login');
      throw new Error('Authentication required');
    }
    return token;
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getToken();
      const res = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
          logout();
          return;
        }
        throw new Error(`Failed to fetch orders: ${res.status}`);
      }

      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  const handleAccept = (acceptedOrderId) => {
    setOrders(prev => prev.map(order => 
      order.id === acceptedOrderId ? { ...order, status: 'processing', staff_id: user?.id } : order
    ));
  };
  
  const handleCancel = (orderId) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId ? { ...order, status: 'cancelled' } : order
    ));
  };
  
  const handleComplete = (orderId) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId ? { ...order, status: 'completed' } : order
    ));
  };
  
  
  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabHeaders}>
        <button
          className={`${styles.tabButton} ${activeTab === 'new' ? styles.active : ''}`}
          onClick={() => setActiveTab('new')}
        >
          Нові замовлення
        </button>
        <button
          className={`${styles.managerTab} ${activeTab === 'manager' ? styles.active : ''} ${styles.tabButton} }`}
          onClick={() => setActiveTab('manager')}
        >
          Менеджер: {user?.firstName} {user?.lastName}
        </button>
      </div>

      <div className={styles.tabContent}>
        {activeTab === 'new' && (
          <>
            <NewOrders
              orders={orders.filter(order => order.status === 'pending')}
              onAccept={handleAccept}
            />
          </>
          
        )}

        {activeTab === 'manager' && (
          <Manager
              orders={orders.filter(order =>
              (order.status === 'processing' && order.staff_id === user?.id) ||
                (order.status === 'completed' && order.staff_id === user?.id)
            )}
            onCancel={handleCancel}
            onComplete={handleComplete}
          />
        )}
      </div>
    </div>
  );
};

export default Orders;


