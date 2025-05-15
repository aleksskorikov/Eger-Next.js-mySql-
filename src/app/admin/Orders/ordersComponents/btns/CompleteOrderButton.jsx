import React from 'react';
import { handleOrderAction } from '../../../../../../pages/api/orders/handleOrderAction';
import styles from './_btns.module.scss';

const CompleteOrderButton = ({ order, onComplete }) => {
    const handleComplete = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Необхідно авторизуватися');
            return;
        }

        handleOrderAction({
            url: `/api/orders/${order.id}`,
            method: 'PATCH',
            data: {
                status: 'completed',
                staff_id: order.staff_id,
            },
            token,
            onSuccess: () => {
                alert('Замовлення успішно завершено!');
                if (onComplete) { 
                    onComplete(order.id);
                } 
            }
        });
    };

    return (
        <button onClick={handleComplete} className={styles.completeButton}>
            Завершити замовлення
        </button>
    );
};

export default CompleteOrderButton;
