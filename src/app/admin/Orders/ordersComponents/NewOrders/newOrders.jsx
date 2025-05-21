import React, { useState, useEffect } from 'react';
import styles from "./_newOrders.module.scss";
import OrderItem from '../OrderItem/OrderItem.jsx';

const NewOrders = ({ orders: initialOrders = [], onAccept, onCancel, onComplete }) => {
    const [localOrders, setLocalOrders] = useState(initialOrders);

    useEffect(() => {
        setLocalOrders(initialOrders);
    }, [initialOrders]);

    const handleUpdateOrder = (updatedOrder) => {
        const actualUpdatedOrder = updatedOrder.order || updatedOrder;
        setLocalOrders(prev => prev.map(order => 
            order.id === actualUpdatedOrder.id 
                ? { ...order, ...actualUpdatedOrder }
                : order
        ));
    };

    if (!localOrders || localOrders.length === 0) {
        return (
            <div className={styles.messageBlock}>
                <p className={styles.message}>На даний момент немає нових замовлень</p>
            </div>
        );
    }

    return (
        <div className={styles.orderBlock}>
            {localOrders.map((order) => (
                <OrderItem
                    key={order.id}
                    order={order}
                    onAccept={onAccept}
                    onCancel={onCancel}
                    onComplete={onComplete}
                    onUpdateOrder={handleUpdateOrder}
                />
            ))}
        </div>
    );
};

export default NewOrders;
