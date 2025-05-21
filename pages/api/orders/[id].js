import { Order, OrderItem , Staff, CompletedOrder } from '../../../models/user.js';
import {Product} from '../../../models/product.js';

async function findOrderById(id) {
  const order = await Order.findByPk(id);
  if (!order) {
    throw new Error('Order not found');
  }
  return order;
}

async function getFullOrderById(id) {
  return await Order.findByPk(id, {
    include: [
      { model: OrderItem, include: [Product] },
      { model: Staff }
    ]
  });
}

async function updateOrCreateCompletedOrder(order) {
  const [completedOrder, created] = await CompletedOrder.upsert({
    order_id: order.id,
    total_price: order.total_price,
    staff_id: order.staff_id,
    completed_at: new Date(),
  }, {
    returning: true,
    conflictFields: ['order_id']
  });

  return {
    completedOrder,
    wasCreated: created,
    message: created ? 'New completed order created' : 'Existing completed order updated'
  };
}

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    if (!id) {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    if (req.method === 'PATCH') {
      const {
        surname, name, patronymic, phone,
        delivery_method, department, address,
        city, region, status, staff_id
      } = req.body;

      const order = await findOrderById(id);

      if (surname !== undefined) order.surname = surname;
      if (name !== undefined) order.name = name;
      if (patronymic !== undefined) order.patronymic = patronymic;
      if (phone !== undefined) order.phone = phone;
      if (delivery_method !== undefined) order.delivery_method = delivery_method;
      if (department !== undefined) order.department = department;
      if (address !== undefined) order.address = address;
      if (city !== undefined) order.city = city;
      if (region !== undefined) order.region = region;
      if (status !== undefined) order.status = status;
      if (staff_id !== undefined) order.staff_id = staff_id;

      await order.save();

      if (order.status === 'completed') {
        const { completedOrder } = await updateOrCreateCompletedOrder(order);
        const updatedOrder = await getFullOrderById(order.id);
        return res.status(200).json({ message: 'Order completed and updated', order: updatedOrder, completedOrder });
      }

      const updatedOrder = await getFullOrderById(order.id);
      return res.status(200).json({ message: 'Order updated', order: updatedOrder });
    }

    if (req.method === 'PUT') {
      const { status, staff_id } = req.body;
      const order = await findOrderById(id);

      if (status !== undefined) order.status = status;
      if (staff_id !== undefined) order.staff_id = staff_id;

      await order.save();

      if (order.status === 'completed') {
        const { completedOrder } = await updateOrCreateCompletedOrder(order);
        const updatedOrder = await getFullOrderById(order.id);
        return res.status(200).json({
          message: 'Order marked as completed and updated in completed orders',
          order: updatedOrder,
          completedOrder
        });
      }

      const updatedOrder = await getFullOrderById(order.id);
      return res.status(200).json({ message: 'Order updated', order: updatedOrder });
    }

    if (req.method === 'DELETE') {
      await CompletedOrder.destroy({ where: { order_id: id } });
      const deleted = await Order.destroy({ where: { id } });

      if (!deleted) {
        return res.status(404).json({ error: 'Order not found' });
      }

      return res.status(200).json({ message: 'Order and its completed record deleted' });
    }

    res.setHeader('Allow', ['PATCH', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
