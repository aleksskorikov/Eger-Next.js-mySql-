import { useState } from 'react';

export default function AnalyticsBot() {
    const [query, setQuery] = useState('');
    const [result, setResult] = useState(null);
    const [sql, setSQL] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        setResult(null);
        console.log('Отправляем запрос:', { query });
        try {
            const res = await fetch('/api/analytics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query })
            });
            const data = await res.json();
            setSQL(data.sql);
            setResult(data.results);
        } catch (e) {
            alert('Ошибка при получении данных');
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const renderTable = (data) => {
        if (!Array.isArray(data) || data.length === 0) return <p>Немає даних для відображення.</p>;

        const headers = Object.keys(data[0]);

        return (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 10 }}>
                <thead>
                    <tr>
                        {headers.map((header) => (
                            <th
                                key={header}
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '8px',
                                    backgroundColor: '#f5f5f5',
                                    textAlign: 'left'
                                }}
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <tr key={index}>
                            {headers.map((header) => (
                                <td key={header} style={{ border: '1px solid #ccc', padding: '8px' }}>
                                    {row[header]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
            <h2>🧠 Аналітика з ІІ</h2>
            <textarea
                rows={4}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Наприклад: Скільки замовлень зроблено у квітні 2025"
                style={{ width: '100%', padding: 10 }}
            />
            <button onClick={handleSubmit} disabled={loading} style={{ marginTop: 10 }}>
                {loading ? 'Генерується...' : 'Запитати'}
            </button>

            {sql && (
                <div style={{ marginTop: 20 }}>
                    <h4>🧾 SQL-запит:</h4>
                    <pre style={{ background: '#f0f0f0', padding: 10 }}>{sql}</pre>
                </div>
            )}

            {result && (
                <div style={{ marginTop: 20 }}>
                    <h4>📊 Результати:</h4>
                    {renderTable(result)}
                </div>
            )}
        </div>
    );
}
