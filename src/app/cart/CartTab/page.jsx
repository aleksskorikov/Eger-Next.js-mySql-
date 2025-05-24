'use client';

import { useState, useEffect } from 'react';
import styles from "./_cartTab.module.scss";
import OrderForm from '../OrderForm/OrderForm.jsx';
import useAuthUser from '../../../../pages/api/users/useAuthUser.js';
import PriceChangeModal from './PriceChangeModal/PriceChangeModal';

const CartTab = ({ removeItem }) => {
    const [showForm, setShowForm] = useState(false);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [priceCheckLoading, setPriceCheckLoading] = useState(false);
    const [changedItems, setChangedItems] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

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
        const priceToUse = item.Product?.isOnSale && item.Product?.sale_price != null
            ? item.Product.sale_price
            : item.price || 0;
        return sum + priceToUse * item.quantity;
    }, 0);

    function getUserIdFromToken(token) {
        try {
            const base64Payload = token.split('.')[1];
            const payload = JSON.parse(atob(base64Payload));
            return payload.user_id || payload.id;
        } catch {
            return null;
        }
    }

    const checkPricesBeforeOrder = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Пользователь не авторизован');
            return;
        }

        const user_id = getUserIdFromToken(token);
        setPriceCheckLoading(true);

        try {
            const productIds = items.map(item => item.product_id);
            const response = await fetch(`/api/orders/prices?ids=${productIds.join(',')}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Не удалось проверить цены товаров');
            }

            const data = await response.json();

            let updatedItems = [...items];
            let localChangedItems = [];

            for (const item of items) {
                const current = data.find(p => p.id === item.product_id);
                if (!current) continue;

                const wasOnSale = item.Product?.isOnSale && item.Product?.sale_price != null;
                const oldFinalPrice = wasOnSale ? item.Product.sale_price : item.price;

                const nowOnSale = current.isOnSale && current.sale_price != null;
                const newFinalPrice = nowOnSale ? current.sale_price : current.price;

                const oldPriceNum = Number(oldFinalPrice);
                const newPriceNum = Number(newFinalPrice);

                if (Math.abs(oldPriceNum - newPriceNum) > 0.001) {
                    localChangedItems.push({
                        name: item.Product?.name || 'Товар',
                        oldPrice: oldFinalPrice,
                        newPrice: newFinalPrice,
                        product_id: item.product_id,
                    });

                    updatedItems = updatedItems.map(it =>
                        it.product_id === item.product_id
                            ? {
                                ...it,
                                price: current.price,
                                Product: {
                                    ...it.Product,
                                    isOnSale: current.isOnSale,
                                    sale_price: current.sale_price,
                                },
                            }
                            : it
                    );
                }
            }

            if (localChangedItems.length === 0) {
                setShowForm(true);
                return;
            }

            setChangedItems(localChangedItems);
            setModalVisible(true);
            setUpdatedItemsForConfirm(updatedItems);

        } catch (error) {
            console.error('Ошибка при проверке цен:', error);
            alert(error.message);
        } finally {
            setPriceCheckLoading(false);
        }
    };

    const [updatedItemsForConfirm, setUpdatedItemsForConfirm] = useState([]);

    const handleConfirmOrder = () => {
        setItems(updatedItemsForConfirm); 
        setShowForm(true);
        setModalVisible(false);
    };

    const handleCancelOrder = async () => {
        const changedProductIds = changedItems.map(ci => ci.product_id);
        const token = localStorage.getItem('token');
        const user_id = getUserIdFromToken(token);

        try {
            const res = await fetch('/api/cart', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ user_id, productIds: changedProductIds }),
            });

            if (!res.ok) {
                throw new Error('Ошибка при удалении товаров из корзины');
            }

            setItems(prevItems => prevItems.filter(item => !changedProductIds.includes(item.product_id)));
        } catch (error) {
            console.error('Ошибка при удалении товаров из корзины:', error);
            alert('Не удалось удалить товары с изменённой ценой из корзины');
        }
        setModalVisible(false);
    };

    const handleOrderSubmit = (orderId) => {
        alert(`Замовлення #${orderId} прийнято!`);
        setShowForm(false);
        setItems([]);
    };

    const handleRemoveItem = async (productId) => {
        await removeItem(productId);
        setItems(prevItems => prevItems.filter(item => item.product_id !== productId));
    };

    if (loading) {
        return <p>Загрузка...</p>;
    }

    return (
        <>
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
                                    {(item.Product?.isOnSale && item.Product?.sale_price != null) ? item.Product.sale_price : item.price}  
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
                                    {(item.Product?.isOnSale && item.Product?.sale_price != null) ? (item.price - item.Product.sale_price) : 0}
                                    <span className={styles.itemSpan}>грн</span>
                                </p>
                                <p className={styles.productItem}>
                                    <span className={styles.itemSpan}>Разом:</span>
                                    {((item.Product?.isOnSale && item.Product?.sale_price != null) ? item.Product.sale_price : item.price) * item.quantity}
                                    <span className={styles.itemSpan}>грн</span>
                                </p>
                                <button onClick={() => handleRemoveItem(item.product_id)} className={styles.productDeliteBtn}>Видалити</button>
                            </div>
                        </div>
                    ))}
                    <h2 className={styles.cardSubtiile}>Загальна сума: {total} грн</h2>
                    {total > 500 && (
                        <button 
                            onClick={checkPricesBeforeOrder} 
                            className={styles.orderBtn}
                            disabled={priceCheckLoading}
                        >
                            {priceCheckLoading ? 'Проверка цен...' : 'Оформити замовлення'}
                        </button>
                    )}
                </div>
            )}

            {showForm && <OrderForm onSubmit={handleOrderSubmit} cartItems={items} />}
        </div>

        {modalVisible && (
            <PriceChangeModal
                changedItems={changedItems}
                onConfirm={handleConfirmOrder}
                onCancel={handleCancelOrder}
            />
        )}
        </>
    );
};

export default CartTab;
