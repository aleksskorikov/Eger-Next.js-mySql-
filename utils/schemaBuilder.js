import { sequelize } from './db';

export async function getDatabaseSchema() {
    const [tables] = await sequelize.query('SHOW TABLES');
    const schema = {};

    const tableKey = Object.keys(tables[0])[0]; 

    for (const row of tables) {
        const tableName = row[tableKey];
        const [columns] = await sequelize.query(`SHOW COLUMNS FROM \`${tableName}\``);
        schema[tableName] = columns.map(col => `${col.Field} (${col.Type})`);
    }

    return schema;
}
