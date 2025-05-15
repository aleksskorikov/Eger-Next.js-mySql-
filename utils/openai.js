// export async function generateSQLFromText(userQuery) {
//     const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': 'Bearer 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', // ← сюда вставь ключ от OpenRouter
//             'HTTP-Referer': 'http://localhost:3000',
//             'X-Title': 'Eger SQL Bot'
//         },
//         body: JSON.stringify({
//             model: 'openai/gpt-3.5-turbo', // или попробуй другие: anthropic/claude-3-opus, mistralai/mixtral-8x7b
//             messages: [
//                 {
//                     role: 'system',
//                     content: 'Ты SQL-бот, который получает на украинском или русском языке вопрос по заказам и генерирует SQL-запрос к базе данных MySQL. Возвращай SQL без объяснений.'
//                 },
//                 {
//                     role: 'user',
//                     content: userQuery
//                 }
//             ]
//         })
//     });

//     if (!response.ok) {
//         throw new Error(`Ошибка от OpenRouter: ${response.status}`);
//     }

//     const data = await response.json();
//     const sql = data.choices?.[0]?.message?.content || 'Нет ответа';
//     return { sql, results: [] }; // ← тут можешь добавить выполнение SQL, если нужно
// }


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
            'Authorization': 'Bearer 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', // твой ключ
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
