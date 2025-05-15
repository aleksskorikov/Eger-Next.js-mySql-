import { sequelize } from '../../../utils/db';
import { User } from '../../../models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Метод не разрешён' });
    }

    try {
        const { email, password, first_name } = req.body;

    if (!email || !password || !first_name) {
    return res.status(400).json({ message: 'Всі поля обовʼязкові' });
    }


        await sequelize.authenticate(); 
        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
        return res.status(409).json({ message: 'Пользователь уже существует' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            email,
            password_hash: hashedPassword,
            first_name,
        });


        const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET || 'secret_key', {
        expiresIn: '7d',
        });

        res.status(201).json({
        message: 'Пользователь зарегистрирован',
        token,
        user: { id: newUser.id, email: newUser.email },
        });

    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
}




