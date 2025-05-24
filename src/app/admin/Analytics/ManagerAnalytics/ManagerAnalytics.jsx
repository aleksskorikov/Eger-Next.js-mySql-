import { useState, useEffect } from 'react';
import ManagerTable from './Components/ManagerTable';
import ManagerModal from './Components/ManagerModal';
import { getManagerAnalytics } from './Components/analyticsUtils';
import DateRangeSelector from '../../Managers/DateRangeSelector/DateRangeSelector';
import styles from './_managerAnalytics.module.scss';

export default function ManagerAnalytics() {
    const [managers, setManagers] = useState([]);
    const [data, setData] = useState(null);
    const [filteredData, setFilteredData] = useState(null);
    const [selectedManager, setSelectedManager] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dateFilter, setDateFilter] = useState({ startDate: null, endDate: null });

    useEffect(() => {
        const fetchManagers = async () => {
            try {
                const res = await fetch('/api/staff');
                if (!res.ok) throw new Error('Ошибка загрузки менеджеров');
                const data = await res.json();
                setManagers(data);
            } catch (err) {
                console.error(err);
                setError('Ошибка загрузки менеджеров');
            }
        };

        const fetchAnalyticsData = async () => {
            try {
                const res = await fetch('/api/analytics/query');
                if (!res.ok) throw new Error('Ошибка загрузки аналитики');
                const jsonData = await res.json();
                setData(jsonData);
                
            } catch (err) {
                console.error(err);
                setError('Ошибка загрузки аналитики');
            }
        };

        Promise.all([fetchManagers(), fetchAnalyticsData()]).finally(() =>
            setLoading(false)
        );
    }, []);

    useEffect(() => {
        if (!data) return;
        const { startDate, endDate } = dateFilter;
        const filterByDate = (items, dateKey) => {
            return items.filter(item => {
                const date = new Date(item[dateKey]);
                return (!startDate || date >= startDate) && (!endDate || date <= endDate);
            });
        };

        const filteredOrders = filterByDate(data.orders || [], 'created_at');
        const cancelledOrders = filteredOrders.filter(order => order.status === 'cancelled');
        const completedOrders = filterByDate(data.completedOrders || [], 'completed_at');
        const inProgressOrders = filteredOrders.filter(order => order.status === 'processing');
    
        const filtered = {
            ...data,
            orders: filteredOrders,
            rejectedOrders: cancelledOrders,
            completedOrders: completedOrders,
            inProgressOrders: inProgressOrders
        };
    
        setFilteredData(filtered);
    }, [data, dateFilter]);
    

    const openModal = (managerId) => {
        setSelectedManager(managerId);
        const fullAnalytics = getManagerAnalytics(managerId, filteredData || data);
        setAnalytics(fullAnalytics);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedManager(null);
        setAnalytics(null);
    };

    if (loading) return <p className={styles.loading}>Загрузка...</p>;
    if (error) return <p className={styles.error}>{error}</p>;

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Менеджеры</h2>
            <DateRangeSelector onFilterChange={({ from, to }) => setDateFilter({ startDate: from, endDate: to })} />

            <ManagerTable
                managers={managers}
                onAnalyticsClick={openModal}
                data={filteredData || data}
            />
            {isModalOpen && analytics && (
                <ManagerModal analytics={analytics} onClose={closeModal} />
            )}
        </div>
    );
}
