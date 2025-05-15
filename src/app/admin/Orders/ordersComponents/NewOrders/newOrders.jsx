import React, { useState } from 'react';
import styles from "./_newOrders.module.scss";
import OrderItem from '../OrderItem/OrderItem.jsx';


const NewOrders = ({ orders, onAccept, onCancel, onComplete }) => {
    const [completedOrders, setCompletedOrders] = useState([]);

    if (!orders || orders.length === 0) {
        return <p>No orders available!</p>;
    }

    return (
        <div className={styles.orderBlock}>
            {orders.map((order) => (
                <OrderItem
                    key={order.id}
                    order={order}
                    onAccept={onAccept}
                    onCancel={onCancel}
                    onComplete={onComplete}
                    completedOrders={completedOrders}
                />
            ))}
        </div>
    );
};

export default NewOrders;



