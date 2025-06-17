import { Review } from '../../../models/review';
import { getUserFromToken } from '../../../utils/auth.js';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  const { method, query } = req;
  const decoded = getUserFromToken(req);

  if (!decoded) {
    return res.status(401).json({ message: 'Неавторизований користувач' });
  }

  const userId = decoded.id;
  const userRole = decoded.role;

  try {
    if (method === 'POST') {
      const { product_id, comment } = req.body;

      if (!product_id || !comment) {
        return res.status(400).json({ message: 'Заповніть всі поля' });
      }

      const review = await Review.create({
        product_id,
        user_id: userId,
        comment,
        messages: JSON.stringify([]),
      });

      return res.status(201).json(review);
    }

    if (method === 'PUT') {
      const { id, comment, response, message } = req.body;

      if (!id) {
        return res.status(400).json({ message: 'Відсутній ID відгуку' });
      }

      const review = await Review.findByPk(id);

      if (!review) {
        return res.status(404).json({ message: 'Відгук не знайдено' });
      }

      if (userRole === 'client' && comment !== undefined) {
        if (review.user_id !== userId) {
          return res.status(403).json({ message: 'Нема доступу' });
        }
        review.comment = comment;
      }

      if ((userRole === 'manager' || userRole === 'admin') && response !== undefined) {
        review.response = response;
        review.staff_id = userId;
      }

      if (message && message.text && message.sender) {
        let messages = [];

        try {
          if (review.messages) {
            messages = Array.isArray(review.messages)
              ? review.messages
              : JSON.parse(review.messages);
          }
        } catch (err) {
          console.error('❌ Ошибка парсинга messages:', err);
          messages = [];
        }

        messages.push({
          id: uuidv4(),
          sender: message.sender,
          text: message.text,
          created_at: new Date().toISOString(),
        });

        review.messages = JSON.stringify(messages);

        if (message.sender === 'staff') {
          review.staff_id = userId;
        }
      }

      review.updated_at = new Date();
      await review.save();

      const responseReview = review.toJSON();
      responseReview.messages = review.messages ? JSON.parse(review.messages) : [];

      return res.status(200).json(responseReview);
    }

    if (method === 'DELETE') {
      const { id } = query;  

      if (!id) {
        return res.status(400).json({ message: 'Відсутній ID' });
      }

      const review = await Review.findByPk(id);

      if (!review) {
        return res.status(404).json({ message: 'Відгук не знайдено' });
      }

      const canDelete =
        (userRole === 'client' && review.user_id === userId) ||
        ((userRole === 'manager' || userRole === 'admin') && review.staff_id === userId);

      if (!canDelete) {
        return res.status(403).json({ message: 'Немає прав для видалення' });
      }

      await review.destroy();

      return res.status(200).json({ message: 'Відгук видалено' });
    }

    return res.status(405).json({ message: `Метод ${method} не дозволено` });
  } catch (error) {
    console.error('❌ Серверна помилка:', error);
    return res.status(500).json({ message: 'Помилка сервера', error: error.message });
  }
}






