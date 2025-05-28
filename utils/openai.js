import dotenv from 'dotenv';
dotenv.config();

import { getDatabaseSchema } from './schemaBuilder';

export async function generateSQLFromText(userQuery) {
    const schema = await getDatabaseSchema();
    const schemaText = Object.entries(schema)
        .map(([table, columns]) => `Table ${table}: ${columns.join(', ')}`)
        .join('\n');

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'HTTP-Referer': 'http://localhost:3000',
            'X-Title': 'Eger SQL Bot'
        },
        body: JSON.stringify({
            model: 'openai/gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: `Ты SQL-бот. Используй только эти таблицы и поля:\n${schemaText}`
                },
                {
                    role: 'user',
                    content: userQuery
                }
            ]
        })
    });

    if (!response.ok) {
        throw new Error(`Ошибка от OpenRouter: ${response.status}`);
    }

    const data = await response.json();
    const sql = data.choices?.[0]?.message?.content || 'Нет ответа';
    return { sql, results: [] };
}
