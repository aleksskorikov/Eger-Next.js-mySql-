'use client';

import React, { useState, useEffect } from 'react';
import AdminProducts from './AdminProducts/page';
import Managers from './Managers/page';
import Orders from './Orders/page';
import Users from './Users/page';
import StaffRegistration from "../admin/adminComponents/StaffRegistration/page";
import { useAuth } from '../../components/users/authContext';
import styles from './_admin.module.scss';
import PendingOrdersCounter from './Orders/ordersComponents/PendingOrdersCounter/pendingOrdersCounter';
import AnalyticsBot from './AnalyticsBot/AnalyticsBot';
import Analitycs from "./Analytics/analitycs";
import Search from "./Search/Search";

const Page = () => {
    const { user } = useAuth(); 
    const [activeTab, setActiveTab] = useState('adminProducts');

    const handleTabClick = (tab) => setActiveTab(tab);

    if (!user) {
        return <StaffRegistration  onClose={() => {}} />;
    }

    const isAdmin = user.role === 'admin';
    const isManager = user.role === 'manager';

    if (!isAdmin && !isManager) {
        return <p className={styles.accessDenied}>У вас немає доступу до цієї сторінки</p>;
    }

    return (
        <div className={styles.tabsContainer}>
            <div className={styles.tabHeaders}>
                {isAdmin && (
                    <button
                        className={`${styles.tabButton} ${activeTab === 'adminProducts' ? styles.active : ''}`}
                        onClick={() => handleTabClick('adminProducts')}
                    >
                        Товари
                    </button>
                )}
                {isAdmin && (
                    <button
                        className={`${styles.tabButton} ${activeTab === 'managers' ? styles.active : ''}`}
                        onClick={() => handleTabClick('managers')}
                    >
                        Співробітники
                    </button>
                )}
                {(isAdmin || isManager) && (
                    <button
                        className={`${styles.tabButton} ${activeTab === 'orders' ? styles.active : ''}`}
                        onClick={() => handleTabClick('orders')}
                    >
                        Замовлення
                        <PendingOrdersCounter/>
                    </button>
                )}
                {(isAdmin || isManager) && (
                    <button
                        className={`${styles.tabButton} ${activeTab === 'users' ? styles.active : ''}`}
                        onClick={() => handleTabClick('users')}
                    >
                        Клієнти
                    </button>
                )}
                {(isAdmin ) && (
                    <button
                        className={`${styles.tabButton} ${activeTab === 'ii' ? styles.active : ''}`}
                        onClick={() => handleTabClick('ii')}
                    >
                        Аналітика II
                    </button>
                )}
                {(isAdmin) && (
                    <button
                        className={`${styles.tabButton} ${activeTab === 'analitics' ? styles.active : ''}`}
                        onClick={() => handleTabClick('analitics')}
                    >
                        Аналітика 
                    </button>
                )}
                {(isAdmin || isManager) && (
                    <button
                        className={`${styles.tabButton} ${activeTab === 'search' ? styles.active : ''}`}
                        onClick={() => handleTabClick('search')}
                    >
                        Пошук
                    </button>
                )}
            </div>

            <div className={styles.tabContent}>
                {activeTab === 'adminProducts' && isAdmin && <AdminProducts />}
                {activeTab === 'managers' && isAdmin && <Managers />}
                {activeTab === 'orders' && (isAdmin || isManager) && <Orders />}
                {activeTab === 'users' && (isAdmin || isManager) && <Users />}
                {activeTab === 'ii' && (isAdmin ) && <AnalyticsBot />}
                {activeTab === 'analitics' && (isAdmin) && <Analitycs />}
                {activeTab === 'search' && (isAdmin || isManager) && <Search />}
            </div>
        </div>
    );
};

export default Page;



