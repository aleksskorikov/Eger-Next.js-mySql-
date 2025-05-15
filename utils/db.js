import { Sequelize } from 'sequelize';
import 'dotenv/config';


const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        dialect: 'mysql',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        logging: false,
    }
);

sequelize.authenticate()
    .then(() => {
        console.log('✅ Успешное подключение к БД');

        sequelize.sync({ force: false }) 
            .then(() => console.log('✅ Таблицы синхронизированы'))
            .catch(error => console.error('Ошибка при синхронизации:', error));
    })
    .catch(err => console.error('❌ Ошибка подключения к БД:', err));

export { sequelize }; 
