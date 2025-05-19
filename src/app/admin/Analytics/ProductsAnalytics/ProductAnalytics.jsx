import { useState } from 'react';
import styles from './_productsAnalytics.module.scss';

const ranges = [
  { label: 'День', value: 'day' },
  { label: 'Неделя', value: 'week' },
  { label: 'Месяц', value: 'month' },
  { label: 'Квартал', value: 'quarter' },
  { label: 'Год', value: 'year' },
  { label: 'Все время', value: 'all' },
];

export default function ProductAnalytics() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState([]);
  const [range, setRange] = useState('all');

  function getFirstSaleDate(orders) {
    const completedOrders = orders.filter(o => o.status === 'completed');
    if (completedOrders.length === 0) return null;
    const dates = completedOrders.map(o => new Date(o.created_at));
    return new Date(Math.min(...dates));
  }

  function getStartDate(range, orders) {
    const firstSaleDate = getFirstSaleDate(orders);
    const now = new Date();

    if (!firstSaleDate) return null;

    switch (range) {
      case 'day':
        return new Date(now.setHours(0, 0, 0, 0));
      case 'week':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case 'month':
        return new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      case 'quarter':
        return new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
      case 'year':
        return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      case 'all':
        return firstSaleDate;
      default:
        return null;
    }
  }

  async function fetchAnalytics() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/analytics/query');
      if (!res.ok) throw new Error('Ошибка загрузки данных');

      const { products, orders, orderItems } = await res.json();
      const startDate = getStartDate(range, orders);
      const todayStart = new Date(new Date().setHours(0, 0, 0, 0));

      const completedOrderIds = new Set(
        orders
          .filter(o => {
            if (o.status !== 'completed') return false;
            
            const created = new Date(o.created_at);
            
            if (range === 'day') {
              return created >= todayStart;
            }
            
            if (startDate) {
              return created >= startDate;
            }
            
            return true;
          })
          .map(o => o.id)
      );

      const completedItems = orderItems.filter(oi => completedOrderIds.has(oi.order_id));
      const productStats = {};

      for (const item of completedItems) {
        if (!productStats[item.product_id]) {
          productStats[item.product_id] = { total_quantity: 0, user_ids: new Set() };
        }
        productStats[item.product_id].total_quantity += item.quantity;

        const order = orders.find(o => o.id === item.order_id);
        if (order) productStats[item.product_id].user_ids.add(order.user_id);
      }

      const result = products
        .filter(p => productStats[p.id])
        .map(p => ({
          id: p.id,
          name: p.name,
          total_quantity: productStats[p.id].total_quantity,
          unique_customers: productStats[p.id].user_ids.size,
        }))
        .sort((a, b) => b.total_quantity - a.total_quantity)
        .slice(0, 50);

      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleOpen() {
    setIsOpen(true);
    fetchAnalytics();
  }

  function handleClose() {
    setIsOpen(false);
    setData([]);
    setError('');
  }

  function handleRangeChange(e) {
    setRange(e.target.value);
    fetchAnalytics();
  }

  return (
    <>
      <button onClick={handleOpen} className={styles.openBtn}>
        Показать аналитику по товарам
      </button>

      {isOpen && (
        <div className={styles.modal}>
          <button onClick={handleClose} className={styles.closeBtn}>✖ Закрыть</button>
          <h2 className={styles.title}>Аналитика по товарам</h2>

          <div className={styles.filters}>
            <label>
              Период:{' '}
              <select value={range} onChange={handleRangeChange} className={styles.select}>
                {ranges.map(({ label, value }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>
          </div>

          {loading && <p>Загрузка...</p>}
          {error && <p className={styles.error}>Ошибка: {error}</p>}
          {!loading && !error && data.length === 0 && <p>Нет данных</p>}

          {!loading && !error && data.length > 0 && (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ID товара</th>
                    <th>Название</th>
                    <th>Общее количество</th>
                    <th>Уникальных покупателей</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map(({ id, name, total_quantity, unique_customers }) => (
                    <tr key={id}>
                      <td>{id}</td>
                      <td>{name}</td>
                      <td>{total_quantity}</td>
                      <td>{unique_customers}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </>
  );
}



