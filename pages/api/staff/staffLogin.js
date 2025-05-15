import { Staff } from '../../../models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; 

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Метод не дозволено' });
    }

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Всі поля обовʼязкові' });
        }

        const staff = await Staff.findOne({ where: { email } });

        if (!staff) {
            return res.status(401).json({ message: 'Невірний email або пароль' });
        }

        const isPasswordValid = await bcrypt.compare(password, staff.password_hash);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Невірний email або пароль' });
        }

        const fullName = `${staff.first_name} ${staff.last_name}`.trim();

        const token = jwt.sign(
            {
                id: staff.id,
                email: staff.email,
                role: staff.role,
            },
            process.env.JWT_SECRET, 
            { expiresIn: '24h' } 
        );

        return res.status(200).json({
            message: 'Успішний вхід',
            token, 
            fullName,
            email: staff.email,
            role: staff.role,
            id: staff.id 
        });
    } catch (error) {
        // console.error('Staff login error:', error);
        return res.status(500).json({ message: 'Серверна помилка' });
    }
}