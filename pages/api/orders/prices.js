import { Product } from '../../../models/product';
import { getUserFromToken } from '../../../utils/auth';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const user = await getUserFromToken(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const ids = req.query.ids;

    if (!ids) {
      return res.status(400).json({ error: 'Missing product IDs' });
    }

    const productIds = ids.split(',').map(id => parseInt(id)).filter(id => !isNaN(id));

    if (productIds.length === 0) {
      return res.status(400).json({ error: 'Invalid product IDs' });
    }

    const products = await Product.findAll({
      where: { id: productIds },
      attributes: ['id', 'price', 'name', 'isOnSale', 'sale_price'],
    });

    return res.status(200).json(products);
  } catch (error) {
    console.error('Failed to fetch product prices:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}



  