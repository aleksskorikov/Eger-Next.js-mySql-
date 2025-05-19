import { generateSQLFromText } from '../../utils/openai';
import { sequelize } from '../../utils/db';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { query } = req.body;
    if (!query) {
        return res.status(400).json({ error: 'Query is required' });
    }

    try {
        const aiResponse = await generateSQLFromText(query);

        let finalSql = '';
        const blockMatch = aiResponse.sql.match(/```sql\s*([\s\S]+?)\s*```/i);
        if (blockMatch) {
            finalSql = blockMatch[1].trim();
        } else {
            const match = aiResponse.sql.match(/SELECT[\s\S]+?;/i);
            if (match) {
                finalSql = match[0].trim();
            }
        }

        if (!finalSql || !finalSql.toUpperCase().startsWith('SELECT')) {
            throw new Error('Не удалось извлечь корректный SQL-запрос из ответа');
        }

        const [results] = await sequelize.query(finalSql);

        res.status(200).json({
            sql: finalSql,
            results
        });
    } catch (err) {
        console.error('Ошибка:', err);
        res.status(500).json({ error: 'Ошибка при выполнении запроса', details: err.message });
    }
}



