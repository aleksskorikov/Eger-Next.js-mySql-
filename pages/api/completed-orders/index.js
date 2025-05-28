import { Order, OrderItem, User, CompletedOrder, Staff } from '../../../models/user.js';
import { Product } from '../../../models/product.js';
import { getUserFromToken } from '../../../utils/auth.js';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const user = await getUserFromToken({ headers: { authorization: authHeader } });

        if (!user || (user.role !== 'manager' && user.role !== 'admin')) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const completedOrders = await CompletedOrder.findAll({
            where: { staff_id: user.id },
            order: [['completed_at', 'DESC']],
            include: [
                {
                    model: Order,
                    include: [
                        {
                            model: OrderItem,
                            include: [Product],
                        },
                        {
                            model: User,
                            attributes: ['id', 'email', 'first_name', 'last_name', 'phone', 'city'],
                        },
                        {
                            model: Staff,
                            attributes: ['id', 'first_name', 'last_name'],
                        },
                    ],
                },
            ],
        });

        const orders = completedOrders.map((completed) => {
            const order = completed.Order;
            return {
                id: completed.id,
                order_id: completed.order_id,
                total_price: completed.total_price,
                completed_at: completed.completed_at,
                items: order?.OrderItems?.map((item) => ({
                    id: item.Product.id,
                    product_name: item.Product.name,
                    quantity: item.quantity,
                    price: item.price,
                    article: item.Product.article,
                })) || [],
                user: order?.User ? {
                    id: order.User.id,
                    full_name: `${order.User.first_name} ${order.User.last_name}`,
                    email: order.User.email,
                    phone: order.User.phone,
                    city: order.User.city,
                } : null,
                staff: order?.Staff ? {
                    id: order.Staff.id,
                    full_name: `${order.Staff.first_name} ${order.Staff.last_name}`,
                } : null,
                shipping_address: {
                    surname: order?.surname,
                    name: order?.name,
                    patronymic: order?.patronymic,
                    phone: order?.phone,
                    region: order?.region,
                    city: order?.city,
                    address: order?.address,
                    delivery_method: order?.delivery_method,
                    department: order?.department,
                    created_at: order?.created_at,
                },
            };
        });

        return res.status(200).json({ orders });
    } catch (error) {
        console.error('Completed orders error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
}



