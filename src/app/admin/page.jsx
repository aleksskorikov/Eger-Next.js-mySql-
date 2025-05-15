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

const Page = () => {
    const { user } = useAuth(); 
    const [activeTab, setActiveTab] = useState('Товари');

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
                        className={`${styles.tabButton} ${activeTab === 'Товари' ? styles.active : ''}`}
                        onClick={() => handleTabClick('Товари')}
                    >
                        Admin Products
                    </button>
                )}
                {isAdmin && (
                    <button
                        className={`${styles.tabButton} ${activeTab === 'Співробітники' ? styles.active : ''}`}
                        onClick={() => handleTabClick('Співробітники')}
                    >
                        Managers
                    </button>
                )}
                {(isAdmin || isManager) && (
                    <button
                        className={`${styles.tabButton} ${activeTab === 'Замовлення' ? styles.active : ''}`}
                        onClick={() => handleTabClick('Замовлення')}
                    >
                        Orders
                        <PendingOrdersCounter/>
                    </button>
                )}
                {(isAdmin || isManager) && (
                    <button
                        className={`${styles.tabButton} ${activeTab === 'Клієнти' ? styles.active : ''}`}
                        onClick={() => handleTabClick('Клієнти')}
                    >
                        Users
                    </button>
                )}
                {(isAdmin || isManager) && (
                    <button
                        className={`${styles.tabButton} ${activeTab === 'Аналітика II' ? styles.active : ''}`}
                        onClick={() => handleTabClick('Аналітика II')}
                    >
                        AI
                    </button>
                )}
            </div>

            <div className={styles.tabContent}>
                {activeTab === 'Товари' && isAdmin && <AdminProducts />}
                {activeTab === 'Співробітники' && isAdmin && <Managers />}
                {activeTab === 'Замовлення' && (isAdmin || isManager) && <Orders />}
                {activeTab === 'Клієнти' && (isAdmin || isManager) && <Users />}
                {activeTab === 'Аналітика II' && (isAdmin || isManager) && <AnalyticsBot />}
            </div>
        </div>
    );
};

export default Page;



