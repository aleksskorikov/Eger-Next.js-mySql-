import { Order, OrderItem, User, CompletedOrder } from '../../../models/user.js';
import { Product } from '../../../models/product.js';
import { getUserFromToken } from '../../../utils/auth.js';

export default async function handler(req, res) {
    const { method, query } = req;
    const type = query.type;

    if (method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
        }

        const token = authHeader.split(' ')[1];
        const user = await getUserFromToken({ headers: { authorization: authHeader } });

        if (!user || (user.role !== 'manager' && user.role !== 'admin')) {
        return res.status(403).json({ error: 'Access denied' });
        }

        let orders = [];

        if (type === 'processing') {
        orders = await Order.findAll({
            where: { staff_id: user.id, status: 'processing' },
            order: [['created_at', 'DESC']],
            include: [
            {
                model: OrderItem,
                include: [Product],
            },
            ],
        });
        } else if (type === 'completed') {
        orders = await CompletedOrder.findAll({
            where: { staff_id: user.id },
            order: [['created_at', 'DESC']],
            include: [
            {
                model: OrderItem,
                include: [Product],
            },
            ],
        });
        } else {
        return res.status(400).json({ error: 'Invalid order type' });
        }
        return res.status(200).json({ orders });
    } catch (error) {
        console.error('Manager orders error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
}




