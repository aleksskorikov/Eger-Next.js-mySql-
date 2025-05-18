import { useEffect, useRef, useState } from 'react';
import styles from "./_pendingOrdersCounter.module.scss"

export default function PendingOrdersCounter() {
    const [count, setCount] = useState(0);
    const prevCountRef = useRef(0);
    const audioRef = useRef(null);

    useEffect(() => {
        audioRef.current = new Audio('/mp3/delkimbite.mp3'); 

        const fetchCount = async () => {
            try {
                const res = await fetch('/api/orders/pending-count');
                const data = await res.json();

                if (data.count > prevCountRef.current) {
                    audioRef.current?.play().catch((e) => {
                        console.warn('Не удалось воспроизвести звук:', e);
                    });
                }

                prevCountRef.current = data.count;
                setCount(data.count);
            } catch (err) {
                console.error('Ошибка при получении количества заказов:', err);
            }
        };

        fetchCount();

        const interval = setInterval(fetchCount, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className={`${styles.count} ${count > 0 ? styles.active : ''}`}>
            {count}
        </div>
    );
    
}

