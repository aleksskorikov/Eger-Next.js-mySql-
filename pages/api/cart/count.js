import { Cart } from '../../../models/user';

export default async function handler(req, res) {
    const { method } = req;

    if (method === 'GET') {
        try {
        const { user_id } = req.query;

        if (!user_id) {
            console.warn('Ошибка: Не передан user_id');
            return res.status(401).json({ message: "Не авторизован", count: 0 });
        }

        const items = await Cart.findAll({
            where: { user_id },
        });

        if (!items || items.length === 0) {
            console.warn(`Корзина пустая для пользователя с ID: ${user_id}`);
            return res.status(200).json({ count: 0 });
        }

        res.status(200).json({ count: items.length });
        } catch (error) {
        console.error('Ошибка при подсчёте товаров в корзине:', error.message);
        res.status(500).json({ message: "Ошибка сервера", error: error.message, count: 0 });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Метод ${method} не разрешён`);
    }
}

