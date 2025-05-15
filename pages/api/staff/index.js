import { Staff } from '../../../models/user.js';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';

export default async function handler(req, res) {
    const { method } = req;
    const { id } = req.query;

    const processInput = (data) => {
        const processed = { ...data };
        
        const dateFields = ['birth_date', 'passport_issued_date', 'employment_date', 'dismissal_date'];
        dateFields.forEach(field => {
            if (!processed[field] || processed[field] === 'Invalid date') {
                processed[field] = null;
            }
        });

        if (processed.password) {
            const saltRounds = 10;
            processed.password_hash = bcrypt.hashSync(processed.password, saltRounds);
            delete processed.password;
        }

        return processed;
    };

    try {
        switch (method) {
            case 'PUT':
                if (!id) {
                    return res.status(400).json({ error: 'ID сотрудника обязателен' });
                }

                const staffToUpdate = await Staff.findByPk(id);
                if (!staffToUpdate) {
                    return res.status(404).json({ error: 'Сотрудник не найден' });
                }

                const updateData = processInput(req.body);

                if (!updateData.password_hash) {
                    updateData.password_hash = staffToUpdate.password_hash;
                }

                await staffToUpdate.update(updateData);
                return res.status(200).json(await Staff.findByPk(id));

        case 'GET':
            try {
                if (id) {
                    const staff = await Staff.findByPk(id);
                    if (!staff) {
                        return res.status(404).json({ error: 'Сотрудник не найден' });
                    }
                    return res.status(200).json(staff);
                } else {
                    const staffList = await Staff.findAll();
                    return res.status(200).json(staffList);
                }
            } catch (error) {
                console.error('GET /api/staff ошибка:', error);
                return res.status(500).json({ 
                    error: 'Ошибка при получении данных сотрудника',
                    details: error.message 
                });
            }
                    
        case 'POST':
            try {
                const { password, ...staffData } = req.body;

                if (!password) {
                    return res.status(400).json({ error: 'Пароль обязателен' });
                }

                const saltRounds = 10;
                const password_hash = await bcrypt.hash(password, saltRounds);
                
                const dateFields = ['dismissal_date', 'birth_date', 'employment_date', 'passport_issued_date'];
                dateFields.forEach(field => {
                    if (staffData[field] === 'Invalid date' || staffData[field] === '' || staffData[field] === null) {
                        staffData[field] = null;
                    }
                });

                const newStaff = await Staff.create({
                    ...staffData,
                    password_hash,
                });

                return res.status(201).json(newStaff);
            } catch (error) {
                console.error('POST /api/staff ошибка:', error);
                return res.status(500).json({ 
                    error: 'Ошибка при создании сотрудника',
                    details: error.message 
                });
            }

            default:
                res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
                return res.status(405).json({ error: `Метод ${method} не разрешен` });
        }
    } catch (error) {
        console.error('Ошибка в API сотрудников:', {
            method,
            id,
            error: error.message,
            stack: error.stack,
            body: req.body
        });

        return res.status(500).json({
            error: 'Внутренняя ошибка сервера',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

