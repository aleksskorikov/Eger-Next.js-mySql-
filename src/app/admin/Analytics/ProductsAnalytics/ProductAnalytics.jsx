'use client';

import { useState } from 'react';
import DateRangeSelector from '../../Managers/DateRangeSelector/DateRangeSelector';
import styles from './_productsAnalytics.module.scss';

export default function ProductAnalytics() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState({ from: null, to: null });

  async function fetchAnalytics(filter) {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/analytics/query');
      if (!res.ok) throw new Error('Ошибка загрузки данных');

      const { products, orders, orderItems } = await res.json();
      const completedOrderIds = new Set(
        orders
          .filter(o => {
            if (o.status !== 'completed') return false;
            const created = new Date(o.created_at);
            if (filter.from && created < filter.from) return false;
            if (filter.to && created > filter.to) return false;
            return true;
          })
          .map(o => o.id)
      );

      const completedItems = orderItems.filter(oi => completedOrderIds.has(oi.order_id));
      const productStats = {};

      for (const item of completedItems) {
        const key = `${item.product_id}_${item.price}`; // уникальная комбинация ID и цены

        if (!productStats[key]) {
          const product = products.find(p => p.id === item.product_id);
          productStats[key] = {
            id: item.product_id,
            name: product ? product.name : `Неизвестный товар #${item.product_id}`,
            price: item.price,
            total_quantity: 0,
            total_sum: 0,
            user_ids: new Set(),
          };
        }

        const stat = productStats[key];
        stat.total_quantity += item.quantity;
        stat.total_sum += item.price * item.quantity;

        const order = orders.find(o => o.id === item.order_id);
        if (order) stat.user_ids.add(order.user_id);
      }

      const result = Object.values(productStats)
        .map(p => ({
          ...p,
          unique_customers: p.user_ids.size,
        }))
        .sort((a, b) => b.total_quantity - a.total_quantity)
        .slice(0, 100); // при необходимости ограничь

      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleOpen() {
    setIsOpen(true);
    fetchAnalytics(filter);
  }

  function handleClose() {
    setIsOpen(false);
    setData([]);
    setError('');
  }

  function handleFilterChange(newFilter) {
    setFilter(newFilter);
    fetchAnalytics(newFilter);
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

          <DateRangeSelector onFilterChange={handleFilterChange} />

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
                    <th>Цена за единицу</th>
                    <th>Количество</th>
                    <th>Общая сумма</th>
                    <th>Уникальные покупатели</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map(({ id, name, price, total_quantity, total_sum, unique_customers }) => (
                    <tr key={`${id}_${price}`}>
                      <td>{id}</td>
                      <td>{name}</td>
                      <td>{price.toFixed(2)} ₴</td>
                      <td>{total_quantity}</td>
                      <td>{total_sum.toFixed(2)} ₴</td>
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

