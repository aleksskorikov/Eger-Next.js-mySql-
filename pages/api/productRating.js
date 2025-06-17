import { ProductRating } from '../../models/productRating.js'; 

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { product_id } = req.query;

        if (!product_id) {
        return res.status(400).json({ error: 'Missing product_id' });
        }

        try {
        const ratings = await ProductRating.findAll({ where: { product_id } });
        const count = ratings.length;
        const average = count === 0 ? 0 : (ratings.reduce((acc, r) => acc + r.rating, 0) / count).toFixed(1);

        return res.status(200).json({ average: parseFloat(average), count });
        } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
        }
    }

    if (req.method === 'POST') {
        const { product_id, user_id, rating } = req.body;

        if (!product_id || !user_id || !rating) {
        return res.status(400).json({ error: 'Missing fields' });
        }

        try {
        const existing = await ProductRating.findOne({
            where: { product_id, user_id }
        });

        if (existing) {
            existing.rating = rating;
            await existing.save();
            return res.status(200).json({ message: 'Rating updated' });
        }

        await ProductRating.create({ product_id, user_id, rating });
        return res.status(201).json({ message: 'Rating created' });
        } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
        }
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
}

