import { Op } from 'sequelize';
import { Product, ProductImage, ProductDescription } from '../../models/product';

export default async function handler(req, res) {
    const { method } = req;

    if (method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ message: `Метод ${method} не дозволений` });
    }

    try {
        const { query } = req.query;

        if (!query || query.trim() === '') {
        return res.status(400).json({ message: 'Порожній запит' });
        }

        const searchTerm = query.trim();

        const products = await Product.findAll({
        where: {
            [Op.or]: [
            { name: { [Op.like]: `%${searchTerm}%` } },
            { article: { [Op.like]: `%${searchTerm}%` } },
            ],
        },
        limit: 10,
        order: [['name', 'ASC']],
        attributes: ['id', 'name', 'article', 'price', 'isOnSale', 'sale_price', 'description', 'status'],
        include: [
            {
            model: ProductImage,
            attributes: ['image_url'],
            },
            {
            model: ProductDescription,
            attributes: ['description_text', 'description_order'],
            },
        ],
        });

        return res.status(200).json({ products });
    } catch (err) {
        console.error('Помилка при пошуку товарів:', err);
        return res.status(500).json({ message: 'Помилка сервера', error: err.message });
    }
}

