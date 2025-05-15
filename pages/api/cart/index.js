import { Cart } from '../../../models/user';
import { Product } from "../../../models/product";

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'GET') {
    try {
      const { user_id } = req.query;

      if (!user_id) {
        console.warn('Ошибка: Не передан user_id');
        return res.status(401).json({ message: "Не авторизован" });
      }

      const items = await Cart.findAll({
        where: { user_id },
        include: [{ model: Product }],
      });

      if (!items || items.length === 0) {
        console.warn(`Корзина пустая для пользователя с ID: ${user_id}`);
        return res.status(200).json({ items: [] });
      }

      res.status(200).json({ items });
    } catch (error) {
      console.error('Ошибка при получении корзины:', error.message);
      res.status(500).json({ message: "Ошибка сервера", error: error.message });
    }
  } else if (method === 'POST') {
    try {
      const { user_id, product_id, quantity } = req.body;

      if (!user_id || !product_id) {
        console.warn('Ошибка: недостаточно данных для добавления товара');
        return res.status(400).json({ message: "Данные отсутствуют" });
      }

      await Cart.create({
        user_id,
        product_id,
        quantity: quantity || 1,
      });

      res.status(200).json({ message: "Товар добавлен в корзину" });
    } catch (err) {
      console.error("Ошибка при добавлении товара в корзину:", err);
      res.status(500).json({ message: "Ошибка сервера" });
    }
  } else if (method === 'PUT') {
    try {
      const { user_id, product_id, quantity } = req.body;

      if (!user_id || !product_id) {
        return res.status(400).json({ message: "Необхідні дані відсутні" });
      }

      const existingItem = await Cart.findOne({
        where: { user_id, product_id }
      });

      if (existingItem) {
        existingItem.quantity += quantity || 1;
        await existingItem.save();
        return res.status(200).json({ message: "Кількість товару оновлена" });
      } else {
        return res.status(404).json({ message: "Товар не знайдено у корзині" });
      }
    } catch (error) {
      console.error("PUT error:", error);
      res.status(500).json({ message: "Помилка сервера", error: error.message });
    }
  }
  
  
  else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT']);
    res.status(405).end(`Метод ${method} не разрешён`);
  } 
    
  
}  