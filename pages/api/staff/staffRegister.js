import { Staff } from '../../../models/user';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Метод не дозволено' });
    }

    try {
        const { fullName, email, password } = req.body;

        if (!email || !password || !fullName) {
            return res.status(400).json({ message: 'Всі поля обовʼязкові' });
        }

        const existingStaff = await Staff.findOne({ where: { email } });
        if (existingStaff) {
            return res.status(400).json({ message: 'Користувач вже існує' });
        }

        const [first_name, last_name = ''] = fullName.trim().split(' ');
        const password_hash = await bcrypt.hash(password, 10);

        const staff = await Staff.create({
            email,
            password_hash,
            first_name,
            last_name,
            role: 'manager', 
        });

        return res.status(201).json({ message: 'Співробітника створено', staff: { email: staff.email, role: staff.role } });
    } catch (error) {
        console.error('Staff register error:', error);
        return res.status(500).json({ message: 'Серверна помилка' });
    }
}
