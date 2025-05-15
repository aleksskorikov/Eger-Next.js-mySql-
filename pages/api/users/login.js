import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../../../models/user'; 
import { sequelize } from '../../../utils/db';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Метод не поддерживается' });
    }

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Заповніть всі поля' });
        }

        await sequelize.sync();

        const user = await User.findOne({ where: { email } });

        if (!user) {
            alert('Користувача не знайдено');
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ message: 'Невірний пароль' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        return res.status(200).json({
            id: user.id,
            first_name: user.first_name,
            email: user.email,
            role: user.role,
            token,
        });
    } catch (err) {
        // console.error('Login error:', err);
        return res.status(500).json({ message: 'Помилка сервера' });
    }
}


