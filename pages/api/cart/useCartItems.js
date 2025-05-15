import { useEffect, useState, useCallback } from 'react';
import useAuthUser from '../users/useAuthUser';

const useCartItems = () => {
  const user = useAuthUser();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    if (!user) {
      console.warn('Пользователь не авторизован');
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('Токен отсутствует');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/cart?user_id=${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error('Ошибка при получении корзины', res.status, res.statusText);
        throw new Error('Ошибка при получении корзины');
      }

      const data = await res.json();
      console.log('Данные корзины получены:', data);

      if (!Array.isArray(data.items)) {
        console.warn('Некорректный формат данных корзины');
        setItems([]);
      } else {
        if (data.items.length === 0) {
          console.warn('Корзина пустая');
        }
        setItems(data.items);
      }
    } catch (err) {
      console.error('Ошибка при получении товаров из корзины:', err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchItems();
  }, [user, fetchItems]);

  const removeItem = async (productId) => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.warn('Токен отсутствует при попытке удаления товара');
      return;
    }

    try {
      const res = await fetch(`/api/cart/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error('Ошибка при удалении товара из корзины', res.status, res.statusText);
        throw new Error('Ошибка при удалении товара');
      }

      fetchItems();
    } catch (err) {
      console.error('Ошибка при удалении товара:', err);
    }
  };

  return { items, loading, removeItem };
};

export default useCartItems;
