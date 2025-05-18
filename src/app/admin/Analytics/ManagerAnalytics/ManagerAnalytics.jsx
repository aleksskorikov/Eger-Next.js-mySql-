import { useState, useEffect } from 'react';
import styles from './_managerAnalytics.module.scss';

const periods = [
    { label: 'Месяц', value: 'month' },
    { label: 'Квартал', value: 'quarter' },
    { label: 'Полгода', value: 'halfyear' },
    { label: 'Год', value: 'year' },
    { label: 'Все время', value: 'all' },
    ];

    export default function ManagerAnalytics() {
    const [managers, setManagers] = useState([]);
    const [data, setData] = useState(null);
    const [selectedManager, setSelectedManager] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [period, setPeriod] = useState('all');

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

    const openModal = (managerId) => {
        setSelectedManager(managerId);
        if (!data) return;
        const filteredAnalytics = getManagerAnalytics(managerId, data, period);
        setAnalytics(filteredAnalytics);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedManager(null);
        setAnalytics(null);
    };

    useEffect(() => {
        if (selectedManager && data) {
        const filteredAnalytics = getManagerAnalytics(selectedManager, data, period);
        setAnalytics(filteredAnalytics);
        }
    }, [period, selectedManager, data]);

    if (loading) return <p className={styles.loading}>Загрузка...</p>;
    if (error) return <p className={styles.error}>{error}</p>;

    return (
        <div className={styles.container}>
        <h2 className={styles.title}>Менеджеры</h2>
        <table className={styles.table}>
            <thead>
            <tr>
                <th>ID</th>
                <th>Имя</th>
                <th>Фамилия</th>
                <th>Роль</th>
                <th>Действие</th>
            </tr>
            </thead>
            <tbody>
            {managers.map((m) => (
                <tr key={m.id}>
                <td>{m.id}</td>
                <td>{m.first_name}</td>
                <td>{m.last_name}</td>
                <td>{m.role}</td>
                <td>
                    <button
                    className={styles.openBtn}
                    onClick={() => openModal(m.id)}
                    aria-label={`Показать аналитику для ${m.first_name} ${m.last_name}`}
                    >
                    Аналитика
                    </button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>

        {isModalOpen && analytics && (
            <div className={styles.modalOverlay} onClick={closeModal}>
            <div
                className={styles.modal}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                <button className={styles.closeBtn} onClick={closeModal}>
                ✖ Закрыть
                </button>

                <h3 id="modal-title" className={styles.analyticsTitle}>
                Аналитика по менеджеру
                </h3>

                <div className={styles.periodSelector}>
                <label htmlFor="periodSelect">Период: </label>
                <select
                    id="periodSelect"
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                >
                    {periods.map(({ label, value }) => (
                    <option key={value} value={value}>
                        {label}
                    </option>
                    ))}
                </select>
                </div>

                <table className={styles.analyticsTable}>
                <tbody>
                    <tr>
                    <td>Всего заказов:</td>
                    <td>{analytics.totalOrders}</td>
                    </tr>
                    <tr>
                    <td>Завершённых заказов:</td>
                    <td>{analytics.completedCount}</td>
                    </tr>
                    <tr>
                    <td>Всего товаров:</td>
                    <td>{analytics.totalProducts}</td>
                    </tr>
                    <tr>
                    <td>Сумма продаж:</td>
                    <td>{analytics.totalSales.toFixed(2)} грн</td>
                    </tr>
                    <tr>
                    <td>Среднее время обработки:</td>
                    <td>{analytics.avgProcessingTime} ч</td>
                    </tr>
                    <tr>
                    <td>Уникальных клиентов:</td>
                    <td>{analytics.uniqueCustomers}</td>
                    </tr>
                </tbody>
                </table>
            </div>
            </div>
        )}
        </div>
    );
    }

    function getStartDateByPeriod(period) {
    const now = new Date();
    switch (period) {
        case 'month':
        return new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        case 'quarter':
        return new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        case 'halfyear':
        return new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
        case 'year':
        return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        case 'all':
        default:
        return new Date(0); 
    }
    }

    function getManagerAnalytics(managerId, data, period) {
    const { orders, completedOrders, orderItems } = data;

    const startDate = getStartDateByPeriod(period);

    const managerOrders = orders.filter(
        (o) =>
        o.staff_id === managerId && new Date(o.created_at) >= startDate
    );

    const managerCompleted = completedOrders.filter(
        (o) =>
        o.staff_id === managerId && new Date(o.completed_at) >= startDate
    );

    const managerOrderIds = new Set(managerOrders.map((o) => o.id));
    const managerItems = orderItems.filter((item) =>
        managerOrderIds.has(item.order_id)
    );

    const totalOrders = managerOrders.length;
    const completedCount = managerCompleted.length;
    const totalProducts = managerItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalSales = managerItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const uniqueCustomers = new Set(managerCompleted.map((o) => o.user_id)).size;

    const avgProcessingTime =
        managerCompleted.length > 0
        ? (
            managerCompleted.reduce((sum, order) => {
                const start = new Date(order.created_at);
                const end = new Date(order.completed_at);
                return sum + (end - start);
            }, 0) /
            managerCompleted.length /
            1000 /
            60 /
            60
            ).toFixed(1)
        : 0;

    return {
        totalOrders,
        completedCount,
        totalProducts,
        totalSales,
        avgProcessingTime,
        uniqueCustomers,
    };
}



