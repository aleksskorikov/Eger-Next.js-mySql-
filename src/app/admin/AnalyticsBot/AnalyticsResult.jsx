'use client';

import styles from "./_analyticsBot.module.scss";

export default function AnalyticsResult({ result }) {
    if (!Array.isArray(result) || result.length === 0) {
        return <p className={styles.noData}>Немає даних для відображення.</p>;
    }

    const headers = Object.keys(result[0]);

    return (
        <div className={styles.container}>
            <div className={styles.result}>
                <h4 className={styles.title}>📊 Результати:</h4>
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                {headers.map((header) => (
                                    <th key={header}>{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {result.map((row, index) => (
                                <tr key={index}>
                                    {headers.map((header) => (
                                        <td key={header}>{row[header]}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            
        </div>
        </div>
        
    );
}
