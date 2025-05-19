'use client';

import { useState, useEffect } from 'react';
import styles from "./_cartTab.module.scss";
import OrderForm from '../OrderForm/OrderForm.jsx';
import useAuthUser from '../../../../pages/api/users/useAuthUser.js';

const CartTab = ({ removeItem }) => {
    const [showForm, setShowForm] = useState(false);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = useAuthUser();

    useEffect(() => {
        const fetchCartData = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                alert('Пользователь не авторизован');
                setLoading(false);
                return;
            }

            if (!user?.id) {
                console.warn('Ожидание загрузки пользователя...');
                return;
            }

            try {
                const response = await fetch(`/api/cart?user_id=${user.id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const result = await response.json();
                    setItems(result.items);
                } else {
                    alert('Не удалось загрузить корзину');
                }
            } catch (error) {
                console.error('Ошибка при получении корзины:', error);
                alert('Ошибка сервера');
            } finally {
                setLoading(false);
            }
        };

        fetchCartData();
    }, [user?.id]);

    const updateQuantity = (productId, delta) => {
        setItems((prevItems) =>
            prevItems.map((item) => {
                if (item.product_id === productId) {
                    const newQuantity = Math.min(20, Math.max(1, item.quantity + delta));
                    return { ...item, quantity: newQuantity };
                }
                return item;
            })
        );
    };

    const total = items.reduce((sum, item) => {
        const discount = item.Product?.discount_price || 0;
        const price = item.Product?.price || 0;
        return sum + (price - discount) * item.quantity;
    }, 0);

    const handleOrderSubmit = (orderId) => {
        alert(`Замовлення #${orderId} прийнято!`);
        setShowForm(false);
        setItems([]); 
    };

    const handleRemoveItem = async (productId) => {
        await removeItem(productId);

        setItems((prevItems) => prevItems.filter(item => item.id !== productId));
    };

    if (loading) {
        return <p>Загрузка...</p>;
    }

    return (
        <div className={styles.main}>
            <h1 className={styles.title}>Корзина</h1>
            {items.length === 0 ? (
                <p className={styles.subTitle}>Корзина пуста</p>
            ) : (
                <div className={styles.cartProductsContainer}>
                    {items.map(item => (
                        <div key={item.id} className={styles.cartProduct}>
                            <h3 className={styles.productTitle}>{item.Product?.name || 'Без назви'}</h3>
                            <div className={styles.productItemsBlock}>
                                <p className={styles.productItem}>
                                    <span className={styles.itemSpan}>Ціна:</span>
                                    {item.Product?.price || 0}
                                    <span className={styles.itemSpan}>грн</span>
                                </p>
                                <p className={styles.productItem}>
                                    <span className={styles.itemSpan}>Кількість:</span>
                                    <button onClick={() => updateQuantity(item.product_id, -1)} className={styles.qtyBtnMin}>▼</button>
                                    <span className={styles.qtyValue}>{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.product_id, 1)} className={styles.qtyBtn}>▲</button>
                                </p>
                                <p className={styles.productItem}>
                                    <span className={styles.itemSpan}>Знижка:</span>
                                    {item.Product?.discount_price || 0}
                                    <span className={styles.itemSpan}>грн</span>
                                </p>
                                <p className={styles.productItem}>
                                    <span className={styles.itemSpan}>Разом:</span>
                                    {(item.Product?.price - (item.Product?.discount_price || 0)) * item.quantity}
                                    <span className={styles.itemSpan}>грн</span>
                                </p>
                                <button onClick={() => handleRemoveItem(item.id)} className={styles.productDeliteBtn}>Видалити</button>
                            </div>
                        </div>
                    ))}
                    <h2 className={styles.cardSubtiile}>Загальна сума: {total} грн</h2>
                    {total > 500 && <button onClick={() => setShowForm(true)} className={styles.orderBtn}>Оформити замовлення</button>}
                </div>
            )}

            {showForm && <OrderForm onSubmit={handleOrderSubmit} cartItems={items} />}
        </div>
    );
};

export default CartTab;

