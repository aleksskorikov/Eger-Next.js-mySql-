import styles from '../_managerAnalytics.module.scss';

export default function ManagerTable({ managers, onAnalyticsClick }) {
    return (
        <table className={styles.table}>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Имя</th>
                    <th>Фамилия</th>
                    <th>Роль</th>
                    <th>Действие</th>
                </tr>
            </thead>
            <tbody>
                {managers.map((m) => (
                    <tr key={m.id}>
                        <td>{m.id}</td>
                        <td>{m.first_name}</td>
                        <td>{m.last_name}</td>
                        <td>{m.role}</td>
                        <td>
                            <button
                                className={styles.openBtn}
                                onClick={() => onAnalyticsClick(m.id)}
                                aria-label={`Показать аналитику для ${m.first_name} ${m.last_name}`}
                            >
                                Аналитика
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
