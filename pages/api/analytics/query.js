// pages/api/analytics/all.js

import { sequelize } from '../../../utils/db';

export default async function handler(req, res) {
    try {
        const [products, orders, orderItems, users, completedOrders] = await Promise.all([
        sequelize.query('SELECT * FROM products', { type: sequelize.QueryTypes.SELECT }),
        sequelize.query('SELECT * FROM orders', { type: sequelize.QueryTypes.SELECT }),
        sequelize.query('SELECT * FROM order_items', { type: sequelize.QueryTypes.SELECT }),
        sequelize.query('SELECT * FROM users', { type: sequelize.QueryTypes.SELECT }),
        sequelize.query('SELECT * FROM completed_orders', { type: sequelize.QueryTypes.SELECT }),
        ]);

        res.status(200).json({
        products,
        orders,
        orderItems,
        users,
        completedOrders,
        });
    } catch (error) {
        console.error('Analytics API error:', error);
        res.status(500).json({ error: 'Failed to fetch analytics data' });
    }
}

