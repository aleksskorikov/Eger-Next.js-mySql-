import { Review } from '../../../models/review';
import { User, Staff } from '../../../models/user';
import { getUserFromToken } from '../../../utils/auth.js';

export default async function handler(req, res) {
  const { method, query } = req;
  const { productId, id } = query;

  if (method === 'GET') {
    if (!productId) {
      return res.status(400).json({ message: 'Відсутній productId у запиті' });
    }

    try {
      const reviews = await Review.findAll({
        where: { product_id: productId },
        attributes: [
          'id',
          'product_id',
          'user_id',
          'staff_id',
          'comment',
          'response',
          'messages',
          'created_at',
          'updated_at'
        ],
        include: [
          { model: User, attributes: ['id', 'first_name', 'last_name'] },
          { model: Staff, attributes: ['id', 'first_name', 'last_name'] },
        ],
        order: [['created_at', 'DESC']],
      });

      return res.status(200).json(reviews);
    } catch (error) {
      console.error('❌ Error fetching reviews:', error);
      return res.status(500).json({
        message: 'Помилка при завантаженні відгуків',
        error: error.message,
      });
    }
  }

  res.setHeader('Allow', ['GET', 'DELETE']);
  return res.status(405).json({ message: `Метод ${method} не дозволено` });
}

