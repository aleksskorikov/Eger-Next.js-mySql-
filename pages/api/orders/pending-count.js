
import { sequelize } from '../../../utils/db';
import { Order } from '../../../models/user'; 

export default async function handler(req, res) {
    try {
        await sequelize.authenticate();

        const count = await Order.count({
        where: { status: 'pending' },
        });

        res.status(200).json({ count });
    } catch (error) {
        console.error('❌ Ошибка при подсчёте заказов:', error.message);
        res.status(500).json({ error: 'Ошибка сервера', details: error.message });
    }
}

