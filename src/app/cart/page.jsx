'use client';

import React, { useState } from 'react';
import useCartItems from '../../../pages/api/cart/useCartItems.js';
import { useAuth } from '../../components/users/authContext.js';
import CartTab from './CartTab/page.jsx';
import OrdersTab from './OrdersTab/page.jsx';
import styles from "./_cart.module.scss";
import ContinueShoppingButton from './CartTab/ContinueShoppingButton.jsx';
import CartCounterBadge from './CartCounterBadge/CartCounterBadge.jsx';
import Favorites from './Favorites/Favorites.jsx';
import AboutMe from './AboutMe/AboutMe.jsx';
import Image from "next/image";
import Loader from '../../components/Loader/Loader.jsx';

const CartPage = () => {
  const { user } = useAuth();
  const { items, loading, removeItem } = useCartItems();
  const [activeTab, setActiveTab] = useState('cart');

  if (!user) return <div className={styles.plugBlock}>
    <p className={styles.plugText}>Будь ласка, увійдіть, щоб переглянути сторінку.</p> 
    <Image
      src='/images/plug .png'
      alt="Login required"
      width={200}      
      height={200}      
      layout="responsive"
    />
  </div>;
  if (loading) return <Loader />


  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabHeaders}>
        <div className={styles.cartBtns}>
          <button onClick={() => setActiveTab('aboutMe')} className={`${styles.tabButton} ${activeTab === 'aboutMe' ? styles.active : ''}`}>
            👼 Про мене
          </button>
          <button onClick={() => setActiveTab('cart')} className={`${styles.tabButton} ${styles.cartBtn} ${activeTab === 'cart' ? styles.active : ''}`}>
            🛒 Корзина
            <div className={styles.myBadgeWrapper}>
              <CartCounterBadge />
            </div>
          </button>
          <button onClick={() => setActiveTab('orders')} className={`${styles.tabButton} ${activeTab === 'orders' ? styles.active : ''}`}>
            📦 Мої замовлення
          </button>
          <button onClick={() => setActiveTab('favorites')} className={`${styles.tabButton} ${activeTab === 'favorites' ? styles.active : ''}`}>
            🧐 Ще подумаю
          </button>
        </div>    
      </div>
      <div className={styles.tabContent}>
        {activeTab === 'aboutMe' && <AboutMe />}
        {activeTab === 'cart' && <CartTab items={items} removeItem={removeItem} />}
        {activeTab === 'orders' && <OrdersTab />}
        {activeTab === 'favorites' && <Favorites />}
        <div className={styles.tabBtn}>
          <ContinueShoppingButton/>
        </div>
        
      </div>
    </div>

  );
};

export default CartPage;

