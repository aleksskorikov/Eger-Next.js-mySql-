import { User } from '../../../models/user.js';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
    const { method } = req;
    const { id } = req.query;

    const processInput = (data) => {
        const cleaned = { ...data };

        // Обробка дат
        const dateFields = ['birth_date', 'passport_issued_date', 'employment_date', 'dismissal_date'];
        for (const field of dateFields) {
            if (!cleaned[field] || cleaned[field] === 'Invalid date') {
                cleaned[field] = null;
            }
        }

        // Хешування пароля
        if (cleaned.password) {
            cleaned.password_hash = bcrypt.hashSync(cleaned.password, 10);
            delete cleaned.password;
        }

        return cleaned;
    };

    try {
        switch (method) {
            case 'GET':
                if (id) {
                    const user = await User.findByPk(id);
                    if (!user) return res.status(404).json({ error: 'Користувача не знайдено' });
                    return res.status(200).json(user);
                } else {
                    const allUsers = await User.findAll();
                    return res.status(200).json(allUsers);
                }

            case 'POST':
                const { password, ...rest } = req.body;
                if (!password) return res.status(400).json({ error: 'Пароль обовʼязковий' });

                const password_hash = await bcrypt.hash(password, 10);
                const preparedData = processInput({ ...rest, password_hash });
                const newUser = await User.create(preparedData);
                return res.status(201).json(newUser);

            case 'PUT':
                try {
                    const { id, first_name, last_name, phone, city, role, middle_name, email } = req.body;
            
                    if (!id) {
                    return res.status(400).json({ error: 'Не вказано ID' });
                    }
            
                    const user = await User.findByPk(id);
            
                    if (!user) {
                    return res.status(404).json({ error: 'Користувача не знайдено' });
                    }
            
                    await user.update({ first_name, last_name, phone, city, role, middle_name, email });
            
                    return res.status(200).json(user);
                } catch (error) {
                    console.error('PUT /api/adminUsers error:', error);
                    return res.status(500).json({ error: error.message });
                }

            case 'DELETE':
                if (!id) return res.status(400).json({ error: 'ID обовʼязковий для видалення' });
                const userToDelete = await User.findByPk(id);
                if (!userToDelete) return res.status(404).json({ error: 'Користувача не знайдено' });
                await userToDelete.destroy();
                return res.status(200).json({ message: 'Користувач видалений' });

            default:
                res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
                return res.status(405).json({ error: `Метод ${method} не підтримується` });
        }
    } catch (error) {
        console.error('Помилка API /users:', error);
        return res.status(500).json({
            error: 'Внутрішня помилка сервера',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}
