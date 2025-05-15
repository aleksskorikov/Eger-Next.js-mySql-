import React, { useState } from 'react';
import { handleOrderAction } from '../../../../../../pages/api/orders/handleOrderAction';
import styles from './_btns.module.scss';

const CancelOrderButton = ({ orderId, onCancel }) => {
    const [orderStatus, setOrderStatus] = useState(null);

    const handleCancel = () => {
        handleOrderAction({
            url: `/api/orders/${orderId}`,
            method: 'PUT',
            data: { status: 'cancelled' },
            onSuccess: () => {
                setOrderStatus('cancelled');
                if (onCancel) { 
                    onCancel(orderId);
                } 
            }
        });
    };

    return (
        <button onClick={handleCancel} className={styles.cancelButton}>
            Скасувати
        </button>
    );
};

export default CancelOrderButton;
