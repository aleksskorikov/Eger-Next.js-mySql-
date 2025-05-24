'use client';

import React, { useState, useEffect } from 'react';
import styles from '.././../Orders/ordersComponents/OrderPeriodFilter/_orderPeriodFilter.module.scss';
import {
    startOfDay,
    startOfWeek,
    startOfMonth,
    startOfQuarter,
    startOfYear
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

const DateRangeSelector = ({ onFilterChange }) => {
    const [period, setPeriod] = useState('all');
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
                onFilterChange({ from: parsedFrom, to: parsedTo });
            } else {
                onFilterChange({ from: null, to: null });
            }
            return;
        }

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
            case 'all':
            default:
                from = null;
                to = null;
        }

        onFilterChange({ from, to });
    }, [period, customFrom, customTo]);

    return (
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
    );
};

export default DateRangeSelector;
