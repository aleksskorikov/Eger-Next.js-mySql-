'use client';

import React, { useState, useEffect } from 'react';
import styles from './_productRating.module.scss';
import useAuthUser from '../../../pages/api/users/useAuthUser'; 

const ProductRating = ({ productId }) => {
    const user = useAuthUser();
    const [userRating, setUserRating] = useState(null);
    const [averageRating, setAverageRating] = useState(0);
    const [totalVotes, setTotalVotes] = useState(0);
    const [hovered, setHovered] = useState(null);

    useEffect(() => {
        const fetchRating = async () => {
        try {
            const res = await fetch(`/api/productRating?product_id=${productId}`);
            const data = await res.json();
            setAverageRating(data.average || 0);
            setTotalVotes(data.count || 0);
        } catch (err) {
            console.error('Помилка при отриманні рейтингу:', err);
        }
        };

        fetchRating();
    }, [productId]);

    const handleRating = async (value) => {
        if (!user) return alert('Тільки авторизовані користувачі можуть голосувати.');

        try {
        const res = await fetch(`/api/productRating`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product_id: productId, user_id: user.id, rating: value }),
        });

        const data = await res.json();
        if (res.ok) {
            setUserRating(value);
            if (data.newAverage !== undefined) setAverageRating(data.newAverage);
            if (data.newCount !== undefined) setTotalVotes(data.newCount);
        } else {
            console.error(data.error);
        }
        } catch (err) {
        console.error('Помилка при оновленні рейтингу:', err);
        }
    };

    const renderStars = () => {
        const stars = [];

        for (let i = 1; i <= 5; i++) {
        let fillLevel = 0; 

        if (hovered !== null) {
            fillLevel = i <= hovered ? 1 : 0; 
        } else {
            if (averageRating >= i) {
            fillLevel = 1;
            } else if (averageRating + 0.5 >= i) {
            fillLevel = 0.5;
            }
        }

        let starClass = '';
        if (fillLevel === 1) starClass = styles.filled;
        else if (fillLevel === 0.5) starClass = styles.half;

        stars.push(
            <span
            key={i}
            className={`${styles.star} ${starClass} ${(userRating || 0) >= i ? styles.userRated : ''}`}
            onMouseEnter={() => user && setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => handleRating(i)}
            >
            ★
            </span>
        );
        }

        return stars;
    };

    return (
        <div className={styles.ratingWrapper}>
        <div className={styles.stars}>{renderStars()}</div>
        <div className={styles.ratingInfo}>
            <span>
            Середній рейтинг: {(averageRating ?? 0).toFixed(1)} ({totalVotes} голосів)
            </span>
            {user && userRating && <span className={styles.userVote}>Ваша оцінка: {userRating}</span>}
        </div>
        </div>
    );
};

export default ProductRating;
