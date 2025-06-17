'use client';

import React, { useEffect, useState } from 'react';
import styles from '../../../admin/Orders/ordersComponents/OrderPeriodFilter/_orderPeriodFilter.module.scss';
import {
    startOfDay,
    startOfWeek,
    startOfMonth,
    startOfQuarter,
    startOfYear,
    isAfter,
    isBefore
} from 'date-fns';


const periods = [
    { label: 'День', value: 'day' },
    { label: 'Тиждень', value: 'week' },
    { label: 'Місяць', value: 'month' },
    { label: 'Квартал', value: 'quarter' },
    { label: 'Рік', value: 'year' },
    { label: 'Увесь час', value: 'all' },
    { label: 'Власний період', value: 'custom' },
];

const OrderPeriodFilter = ({ orders = [], onFiltered }) => {
    const [period, setPeriod] = useState('all');
    const [range, setRange] = useState({ from: null, to: null });

    const [customFrom, setCustomFrom] = useState('');
    const [customTo, setCustomTo] = useState('');

    useEffect(() => {
        const now = new Date();
        let from = null;
        let to = now;

        if (period === 'custom') {
            const parsedFrom = customFrom ? new Date(customFrom) : null;
            const parsedTo = customTo ? new Date(customTo) : null;

            if (parsedFrom && parsedTo && parsedFrom <= parsedTo) {
                from = parsedFrom;
                to = parsedTo;
            } else {
                onFiltered([]); 
                return;
            }
        } else {
            switch (period) {
                case 'day':
                    from = startOfDay(now);
                    break;
                case 'week':
                    from = startOfWeek(now, { weekStartsOn: 1 });
                    break;
                case 'month':
                    from = startOfMonth(now);
                    break;
                case 'quarter':
                    from = startOfQuarter(now);
                    break;
                case 'year':
                    from = startOfYear(now);
                    break;
                default:
                    from = null;
            }
        }

        setRange({ from, to });

        const filtered = !from
            ? orders
            : orders.filter(order => {
                const date = new Date(order.created_at);
                
                return isAfter(date, from) && isBefore(date, to);
            });

        onFiltered(filtered);
    }, [orders, period, customFrom, customTo]);

    return (
        <div className={styles.wrapper}>
            {period !== 'all' && period !== 'custom' && (
                    <p className={styles.periodInfo}>
                        Період: з {range.from?.toLocaleDateString()} по {range.to?.toLocaleDateString()}
                    </p>
            )}
            
            <div className={styles.filterContainer}>
                {periods.map((p) => (
                    <button
                        key={p.value}
                        onClick={() => setPeriod(p.value)}
                        className={`${styles.filterButton} ${period === p.value ? styles.active : ''}`}
                    >
                        {p.label}
                    </button>
                ))}
                
                {period === 'custom' && (
                    <div className={styles.customDateInputs}>
                        <label>
                            З:
                            <input
                                type="date"
                                value={customFrom}
                                onChange={(e) => setCustomFrom(e.target.value)}
                            />
                        </label>
                        <label>
                            По:
                            <input
                                type="date"
                                value={customTo}
                                onChange={(e) => setCustomTo(e.target.value)}
                            />
                        </label>
                    </div>
                )}
            </div>
        </div>
        
    );
};

export default OrderPeriodFilter;