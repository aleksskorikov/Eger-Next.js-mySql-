'use client';

import React, { useState } from 'react';
import styles from './_productReviews.module.scss';

export default function ReviewForm({ productId, onCancel, onSuccess }) {
    const [newComment, setNewComment] = useState('');

    const getToken = () => localStorage.getItem('token');

    const handleAddReview = async () => {
        if (!newComment.trim()) return alert('Коментар не може бути пустим');

        const token = getToken();

        try {
        const res = await fetch('/api/reviews', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
            product_id: productId,
            comment: newComment,
            }),
        });
        if (res.ok) {
            setNewComment('');
            onSuccess();
        } else {
            const err = await res.json();
            alert(err.message || 'Помилка при додаванні відгуку');
        }
        } catch (e) {
        console.error('Add review error:', e);
        alert('Помилка мережі');
        }
    };

    return (
        <div className={styles.reviewForm}>
        <h4>Ваш відгук</h4>
        <textarea
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Ваш відгук"
            className={styles.textarea}
        />
        <div className={styles.btnGroup}>
            <button className={styles.btnPrimary} onClick={handleAddReview}>Надіслати</button>
            <button className={styles.btnSecondary} onClick={onCancel}>Скасувати</button>
        </div>
        </div>
    );
}
