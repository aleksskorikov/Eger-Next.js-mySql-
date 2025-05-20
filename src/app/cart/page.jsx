'use client';

import React, { useState } from 'react';
import useCartItems from '../../../pages/api/cart/useCartItems.js';
import { useAuth } from '../../components/users/authContext.js';
import CartTab from './CartTab/page.jsx';
import OrdersTab from './OrdersTab/page.jsx';
import styles from "./_cart.module.scss";
import ContinueShoppingButton from './CartTab/ContinueShoppingButton.jsx';
import CartCounterBadge from './CartCounterBadge/CartCounterBadge.jsx';

const CartPage = () => {
  const { user } = useAuth();
  const { items, loading, removeItem } = useCartItems();
  const [activeTab, setActiveTab] = useState('cart');

  if (!user) return <div>Будь ласка, увійдіть, щоб переглянути сторінку.</div>;
  if (loading) return <div>Завантаження...</div>;

  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabHeaders}>
        <div className={styles.cartBtns}>
          <button onClick={() => setActiveTab('cart')} className={`${styles.tabButton} ${styles.cartBtn} ${activeTab === 'cart' ? styles.active : ''}`}>
            🛒 Корзина
            <div className={styles.myBadgeWrapper}>
              <CartCounterBadge />
            </div>
          </button>
          <button onClick={() => setActiveTab('orders')} className={`${styles.tabButton} ${activeTab === 'orders' ? styles.active : ''}`}>
            📦 Мої замовлення
          </button>
        </div>    
      </div>
      <div className={styles.tabContent}>
        {activeTab === 'cart' && <CartTab items={items} removeItem={removeItem} />}
        {activeTab === 'orders' && <OrdersTab />}
        <ContinueShoppingButton/>
      </div>
    </div>

  );
};

export default CartPage;

