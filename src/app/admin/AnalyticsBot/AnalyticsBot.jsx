'use client';

import { useState } from 'react';
import styles from "./_analyticsBot.module.scss";
import AnalyticsResult from './AnalyticsResult';

export default function AnalyticsBot() {
    const [query, setQuery] = useState('');
    const [result, setResult] = useState(null);
    const [sql, setSQL] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        setResult(null);
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

    return (
        <div className={styles.main}>
            <div className={styles.container}>
                <h2 className={styles.title}>🧠 Аналітика з ІІ</h2>
                <textarea
                    rows={4}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Наприклад: Скільки замовлень зроблено у квітні 2025"
                    className={styles.queryInput}
                />
                <button onClick={handleSubmit} disabled={loading} className={styles.submitBtn}>
                    {loading ? 'Генерується...' : 'Запитати'}
                </button>

                
            </div>
            {result && <AnalyticsResult result={result} />}
        </div>
    );
}
