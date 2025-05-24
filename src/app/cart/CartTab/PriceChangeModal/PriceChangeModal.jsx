import React from 'react';
import styles from './_priceChangeModal.module.scss';

const PriceChangeModal = ({ changedItems, onConfirm, onCancel }) => {
    return (
        <div className={styles.overlay}>
        <div className={styles.modal}>
            <h2>Цены на некоторые товары изменились</h2>
            <ul className={styles.list}>
            {changedItems.map(item => (
                <li key={item.product_id}>
                <strong>{item.name}</strong>: была {item.oldPrice} грн, стала {item.newPrice} грн
                </li>
            ))}
            </ul>
            <p>Оформить заказ по новым ценам?</p>
            <div className={styles.buttons}>
            <button onClick={onConfirm} className={styles.confirmBtn}>Оформить заказ</button>
            <button onClick={onCancel} className={styles.cancelBtn}>Удалить товары</button>
            </div>
        </div>
        </div>
    );
};

export default PriceChangeModal;
