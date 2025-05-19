import { Order, CompletedOrder } from '../../../models/user.js';

async function findOrderById(id) {
  const order = await Order.findByPk(id);
  if (!order) {
    throw new Error('Order not found');
  }
  return order;
}

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    if (!id) {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    if (req.method === 'PATCH') {
      const { status, staff_id } = req.body;
      const order = await findOrderById(id);
      order.status = status || order.status;
      if (staff_id) order.staff_id = staff_id;
      console.log('Updating order:', order); 
      await order.save();

      const completedOrder = await CompletedOrder.create({
        order_id: order.id,
        total_price: order.total_price,
        staff_id: order.staff_id,
        completed_at: new Date(),
      });

      // Удаляем завершенный заказ из таблицы заказов
      // await Order.destroy({ where: { id } });

      return res.status(200).json({ message: 'Order completed and moved to completed_orders', completedOrder });
    }

    if (req.method === 'PUT') {
      const { status, staff_id } = req.body;
      const order = await findOrderById(id);
      order.status = status || order.status;
      if (staff_id) order.staff_id = staff_id;
      await order.save();

      return res.status(200).json({ message: 'Order updated', order });
    }

    if (req.method === 'DELETE') {
      const deleted = await Order.destroy({ where: { id } });
      if (!deleted) return res.status(404).json({ error: 'Order not found' });

      return res.status(200).json({ message: 'Order deleted' });
    }

    res.setHeader('Allow', ['PATCH', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

