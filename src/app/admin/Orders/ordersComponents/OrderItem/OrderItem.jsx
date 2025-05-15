import React from 'react';
import styles from "./_orderItem.module.scss";
import AcceptOrderButton from '../btns/AcceptOrderButton';
import CancelOrderButton from '../btns/CancelOrderButton';
import CompleteOrderButton from '../btns/CompleteOrderButton';

const OrderItem = ({ order, onAccept, onCancel, onComplete, completedOrders = []  }) => {

    return (
        <div className={styles.order}>
            <div className={styles.orderHeader}>
                <h3 className={styles.orderTitle}>
                    <span className={styles.span}>Номер замовлення:</span> {order.id}
                </h3>
                <p className={styles.orderStatus}>
                    <span className={styles.span}>Статус замовлення:</span>
                    <span className={`${styles.status} ${
                        order.status === 'pending' ? styles.statusPending :
                        order.status === 'processing' ? styles.statusAccepted :
                        order.status === 'completed' ? styles.statusCompleted :
                        styles.statusCancelled
                    }`}>
                        {order.status === 'processing' ? 'in progress' : order.status}
                    </span>
                </p>
            </div>

            <div className={styles.orderContent}>
                <div className={styles.orderInfo}>
                    <div className={styles.customerInfo}>
                        <h4 className={styles.sectionTitle}>Інформація про клієнта</h4>
                        <p className={styles.sectionText}><span className={styles.span}>ПІБ:</span> {order.surname} {order.name} {order.patronymic}</p>
                        <p className={styles.sectionText}><span className={styles.span}>Телефон:</span> {order.phone}</p>
                    </div>

                    <div className={styles.deliveryInfo}>
                        <h4 className={styles.sectionTitle}>Інформація про доставку</h4>
                        <p className={styles.sectionText}><span className={styles.span}>Метод:</span> {order.delivery_method}</p>
                        {order.department && (
                            <p className={styles.sectionText}><span className={styles.span}>Відділення:</span> {order.department}</p>
                        )}
                        <p className={styles.sectionText}><span className={styles.span}>Адреса:</span> {order.address}, {order.city}, {order.region}</p>
                    </div>

                    <div className={styles.orderItems}>
                        <h4 className={styles.sectionTitle}>Товари в замовленні</h4>
                        <div className={styles.tableWrapper}>
                            <table className={styles.itemsTable}>
                                <thead>
                                    <tr>
                                        <th className={styles.span}>Товар</th>
                                        <th className={styles.span}>Ціна</th>
                                        <th className={styles.span}>К-сть</th>
                                        <th className={styles.span}>Сума</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.OrderItems?.map((item) => (
                                        <tr key={item.id}>
                                            <td className={styles.itemProduct}>
                                                <div className={styles.itemInfo}>
                                                    <div>
                                                        <p className={styles.itemName}>{item.Product?.name || 'No Name'}</p>
                                                        <p className={styles.itemArticle}># {item.Product?.id || 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>${item.price.toFixed(2)}</td>
                                            <td>{item.quantity}</td>
                                            <td>${(item.price * item.quantity).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className={styles.orderSummary}>
                    <div className={styles.summaryLeft}>
                        <p>Створено: {new Date(order.created_at).toLocaleString()}</p>
                        {order.staff_id && (
                            <p>Опрацьовано: {order.Staff?.first_name} {order.Staff?.last_name}</p>
                        )}
                    </div>
                    <div className={styles.summaryRight}>
                        <p>Разом: ${order.total_price.toFixed(2)}</p>
                        <p className={styles.total}>До сплати: ${order.total_price.toFixed(2)}</p>
                    </div>
                </div>

                <div className={styles.orderButtons}>
                    {order.status === 'pending' && (
                        <>
                            <AcceptOrderButton orderId={order.id} onAccepted={onAccept} />
                        </>
                    )}
                    {order.status === 'processing' && !completedOrders.includes(order.id) && (
                        <>
                            <CompleteOrderButton order={order} onComplete={onComplete} />
                            <CancelOrderButton orderId={order.id} onCancel={onCancel} />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderItem;
