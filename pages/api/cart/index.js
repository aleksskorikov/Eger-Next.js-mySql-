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
      const { user_id, product_id, quantity} = req.body;
      if (!user_id || !product_id) {
        console.warn('Ошибка: недостаточно данных для добавления товара');
        return res.status(400).json({ message: "Данные отсутствуют" });
      }

      const product = await Product.findByPk(product_id);
      if (!product) {
        return res.status(404).json({ message: "Товар не найден" });
      }

      const priceToUse = product.isOnSale ? product.sale_price : product.price;

      await Cart.create({
        user_id,
        product_id,
        quantity: quantity || 1,
        price: priceToUse,
      });

      res.status(200).json({ message: "Товар добавлен в корзину" });
    } catch (err) {
      console.error("Ошибка при добавлении товара в корзину:", err);
      res.status(500).json({ message: "Ошибка сервера" });
    }
  } else if (method === 'PUT') {
    try {
      const { user_id, product_id, quantity } = req.body;

      if (!user_id || !product_id || !quantity) {
        return res.status(400).json({ message: "Недостаточно данных для обновления" });
      }

      const cartItem = await Cart.findOne({ where: { user_id, product_id } });

      if (!cartItem) {
        return res.status(404).json({ message: "Товар в корзине не найден" });
      }

      const product = await Product.findByPk(product_id);
      if (!product) {
        return res.status(404).json({ message: "Товар не найден" });
      }

      cartItem.quantity = quantity;
      cartItem.price = product.isOnSale ? product.sale_price : product.price; 
      await cartItem.save();

      res.status(200).json({ message: "Количество товара обновлено" });
    } catch (err) {
      console.error("Ошибка при обновлении товара в корзине:", err);
      res.status(500).json({ message: "Ошибка сервера" });
    }
  } else if (method === 'DELETE') {
    try {
      const { user_id, productIds } = req.body;

      if (!user_id || !productIds || !Array.isArray(productIds) || productIds.length === 0) {
        return res.status(400).json({ message: "Недостаточно данных для удаления" });
      }

      const deletedCount = await Cart.destroy({
        where: {
          user_id,
          product_id: productIds, 
        }
      });

      if (deletedCount === 0) {
        return res.status(404).json({ message: "Товары в корзине не найдены" });
      }

      res.status(200).json({ message: `Удалено товаров: ${deletedCount}` });
    } catch (err) {
      console.error("Ошибка при удалении товаров из корзины:", err);
      res.status(500).json({ message: "Ошибка сервера при удалении" });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Метод ${method} не разрешён`);
  }
}
