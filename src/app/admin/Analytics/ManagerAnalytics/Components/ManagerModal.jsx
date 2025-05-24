import styles from '../_managerAnalytics.module.scss';

export default function ManagerModal({ analytics, onClose }) {

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div
                className={styles.modal}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                <button className={styles.closeBtn} onClick={onClose}>
                    ✖ Закрыть
                </button>

                <h3 id="modal-title" className={styles.analyticsTitle}>
                    Аналитика по менеджеру
                </h3>

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
                            <td>Отклонённых заказов:</td>
                            <td>{analytics.rejectedCount}</td>
                        </tr>
                        <tr>
                            <td>В работте:</td>
                            <td>{analytics.inProgressCount}</td>
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
                    </tbody>
                </table>

                <h4 className={styles.productsTitle}>Товары в заказах:</h4>
                <table className={styles.productsTable}>
                    <thead>
                        <tr>
                            <th>Название товара</th>
                            <th>Количество</th>
                            <th>Цена за единицу</th>
                            <th>Сумма</th>
                        </tr>
                    </thead>
                    <tbody>
                        {analytics.products && analytics.products.length > 0 ? (
                            analytics.products.map((item, idx) => (
                                <tr key={idx}>
                                    <td>{item.name}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.price.toFixed(2)} грн</td>
                                    <td>{(item.price * item.quantity).toFixed(2)} грн</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center' }}>
                                    Нет данных о товарах
                                </td>
                            </tr>
                        )}
                    </tbody>

                </table>
            </div>
        </div>
    );
}
