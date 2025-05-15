import { Cart } from '../../../models/user';

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  if (method === 'DELETE') {
    try {
      const deleted = await Cart.destroy({
        where: { id }, 
      });

      if (deleted === 0) {
        return res.status(404).json({ message: 'Товар не найден в корзине' });
      }

      res.status(200).json({ message: 'Товар удалён из корзины' });
    } catch (err) {
      console.error('Ошибка при удалении товара из корзины:', err);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Метод ${method} не разрешён`);
  }
}
