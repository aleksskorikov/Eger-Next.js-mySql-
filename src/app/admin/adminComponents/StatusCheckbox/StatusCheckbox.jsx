import { useState, useEffect } from 'react';
import styles from "../EditProductForm/_editProductForm.module.scss"

export default function StatusCheckbox({ productId, initialStatus, onStatusChange }) {
    const [status, setStatus] = useState(initialStatus);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setStatus(initialStatus); 
    }, [initialStatus]);

    const handleToggle = async (checked) => {
        if (!productId) {
            console.error("Ошибка: productId не передан в StatusCheckbox");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`/api/products?action=status&id=${productId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: checked }), 
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Ошибка при обновлении статуса');
            }

            setStatus(checked);

            if (onStatusChange) {
                onStatusChange(checked);
            }

        } catch (err) {
            console.error('Ошибка при обновлении статуса:', err);
            setError(err.message);
            setStatus(!checked); 
        } finally {
            setLoading(false);
        }
    };

    return (
        <label >
            <input
                type="checkbox"
                checked={status ?? false}
                onChange={(e) => handleToggle(e.target.checked)}
                disabled={loading}
                className={styles.checkbox}
            />
            Товар, який не можна купити онлайн, має активний статус
            {loading && <span> (обновление...)</span>}
            {error && <span style={{ color: 'red' }}>Ошибка: {error}</span>}
        </label>
    );
}