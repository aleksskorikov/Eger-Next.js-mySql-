import { Review } from '../../../models/review';
import { getUserFromToken } from '../../../utils/auth.js';

export default async function handler(req, res) {
    const { method } = req;

    if (method !== 'DELETE') {
        return res.status(405).json({ message: `Метод ${method} не дозволено` });
    }

    const decoded = getUserFromToken(req);
    if (!decoded) {
        return res.status(401).json({ message: 'Неавторизований користувач' });
    }

    const userId = decoded.id;
    const userRole = decoded.role;
    const { reviewId, messageIndex } = req.body;

    if (typeof reviewId !== 'number' || typeof messageIndex !== 'number') {
        return res.status(400).json({ message: 'Неправильні дані для видалення повідомлення' });
    }

    try {
        const review = await Review.findByPk(reviewId);

        if (!review) {
        return res.status(404).json({ message: 'Відгук не знайдено' });
        }

        let messages = [];
        try {
        messages = Array.isArray(review.messages)
            ? review.messages
            : JSON.parse(review.messages || '[]');
        } catch (e) {
        return res.status(500).json({ message: 'Помилка парсингу повідомлень' });
        }

        if (messageIndex < 0 || messageIndex >= messages.length) {
        return res.status(400).json({ message: 'Невірний індекс повідомлення' });
        }

        const message = messages[messageIndex];
        const isClientMessage = message.sender === 'client';
        const isStaffMessage = message.sender === 'staff';

        const canDelete =
        (userRole === 'client' && isClientMessage && review.user_id === userId) ||
        ((userRole === 'manager' || userRole === 'admin') && isStaffMessage && review.staff_id === userId);

        if (!canDelete) {
        return res.status(403).json({ message: 'У вас немає прав на видалення цього повідомлення' });
        }

        messages.splice(messageIndex, 1);
        review.messages = JSON.stringify(messages);
        review.updated_at = new Date();
        await review.save();

        return res.status(200).json({ message: 'Повідомлення видалено' });
    } catch (error) {
        console.error('❌ Помилка сервера при видаленні повідомлення:', error);
        return res.status(500).json({ message: 'Серверна помилка' });
    }
}

