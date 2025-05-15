import { Order, OrderItem, User, Cart } from '../../../models/user.js';
import { Product } from '../../../models/product.js';
import { sequelize } from '@/utils/db';
import { getUserFromToken } from '../../../utils/auth.js';

export default async function handler(req, res) {
    const user = await getUserFromToken(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    if (req.method === 'GET') {
        try {
            let whereClause = {};
    
            if (user.role === 'client') {
                whereClause.user_id = user.id;
            }
    
            const orders = await Order.findAll({
                where: whereClause,
                order: [['created_at', 'DESC']],
                include: [
                    {
                        model: OrderItem,
                        include: [Product]
                    }
                ]
            });
    
            return res.status(200).json({ orders });
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            return res.status(500).json({ error: 'Failed to load orders' });
        }
    }
    

    if (req.method === 'POST') {
        try {
            const { cartItems, deliveryMethod, ...orderData } = req.body;

            if (!cartItems || cartItems.length === 0) {
                return res.status(400).json({ error: 'Cart is empty' });
            }

            const totalPrice = cartItems.reduce((sum, item) => {
                const price = parseFloat(item.Product?.price);
                const quantity = parseInt(item.quantity, 10);

                if (isNaN(price) || isNaN(quantity)) {
                    throw new Error(`Некорректная цена или количество для товара с product_id ${item.product_id}`);
                }

                return sum + price * quantity;
            }, 0);

            if (isNaN(totalPrice)) {
                return res.status(400).json({ error: 'Invalid cart items, cannot calculate total price' });
            }

            const newOrder = await sequelize.transaction(async (t) => {
                const order = await Order.create({
                    ...orderData,
                    user_id: user.id,
                    total_price: totalPrice,
                    delivery_method: deliveryMethod,
                }, { transaction: t });

                await Promise.all(
                    cartItems.map(async (item) => {
                        const product = await Product.findByPk(item.product_id);
                        if (!product) {
                            throw new Error(`Product with id ${item.product_id} not found`);
                        }

                        await OrderItem.create({
                            order_id: order.id,
                            product_id: item.product_id,
                            quantity: item.quantity,
                            price: product.price,
                        }, { transaction: t });
                    })
                );

                await Cart.destroy({
                    where: { user_id: user.id },
                    transaction: t
                });

                return order;
            });

            res.status(201).json({ success: true, orderId: newOrder.id });

        } catch (error) {
            console.error('Order creation failed:', error);
            res.status(500).json({ error: error.message || 'Server error' });
        }
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}
