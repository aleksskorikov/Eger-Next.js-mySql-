import { Order, OrderItem, CompletedOrder } from '../../../models/user';

export default async function handler(req, res) {
  const { id } = req.query;
  const productId = Number(id);

  if (!productId || isNaN(productId)) {
    return res.status(400).json({ error: 'Некорректный productId' });
  }

  try {
    const items = await OrderItem.findAll({
      where: { product_id: productId },
      include: [
        {
          model: Order,
          required: true,
          include: [
            {
              model: CompletedOrder,
              required: true,
            }
          ]
        }
      ]
    });

    if (!items.length) {
      return res.json({
        total_quantity: 0,
        total_revenue: 0,
        period: null,
        sales: [],
      });
    }

    const sales = items.map(item => {
      const order = item.Order;
      const completedOrder = order.CompletedOrder;

      return {
        date: order.created_at ? order.created_at.toISOString().split('T')[0] : 'неизвестно',
        quantity: item.quantity,
        price: item.price,
        orderId: order.id,
      };
    });

    const total_quantity = items.reduce((sum, i) => sum + i.quantity, 0);
    const total_revenue = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);

    const dates = sales.map(s => new Date(s.date)).sort((a, b) => a - b);
    const period = {
      start: dates[0].toISOString().split('T')[0],
      end: dates[dates.length - 1].toISOString().split('T')[0],
    };

    return res.json({ total_quantity, total_revenue, period, sales });

  } catch (error) {
    console.error('Ошибка при получении аналитики:', error);
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
}





