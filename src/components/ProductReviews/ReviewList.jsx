'use client';

import React, { useState } from 'react';
import styles from './_productReviews.module.scss';

export default function ReviewList({ user, reviews, fetchReviews, showAll, setShowAll }) {
    const [editReviewId, setEditReviewId] = useState(null);
    const [editComment, setEditComment] = useState('');
    const [chatInputs, setChatInputs] = useState({});
    const getToken = () => localStorage.getItem('token');
    const startEdit = (review) => {
        setEditReviewId(review.id);
        setEditComment(review.comment);
    };
    const cancelEdit = () => {
        setEditReviewId(null);
        setEditComment('');
    };
    const handleSaveEdit = async () => {
        if (!editComment.trim()) return alert('Коментар не може бути пустим');

        const token = getToken();
        try {
        const res = await fetch('/api/reviews', {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ id: editReviewId, comment: editComment }),
        });
        if (res.ok) {
            cancelEdit();
            fetchReviews();
        } else {
            const err = await res.json();
            alert(err.message || 'Помилка при збереженні');
        }
        } catch (e) {
        console.error('Save edit error:', e);
        alert('Помилка мережі');
        }
    };

    const handleDelete = async (reviewId) => {
        if (!confirm('Ви впевнені, що хочете видалити?')) return;

        const token = getToken();
        try {
        const res = await fetch(`/api/reviews?id=${reviewId}`, {
            method: 'DELETE',
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });
        if (res.ok) {
            fetchReviews();
        } else {
            const err = await res.json();
            alert(err.message || 'Помилка при видаленні');
        }
        } catch (e) {
        console.error('Delete error:', e);
        alert('Помилка мережі');
        }
    };

    const handleSendMessage = async (reviewId) => {
        const text = chatInputs[reviewId]?.trim();
        if (!text) return;

        const token = getToken();
        const payload = {
        id: reviewId,
        message: {
            sender: (user.role === 'manager' || user.role === 'admin') ? 'staff' : 'client',
            text,
        },
        };

        try {
        const res = await fetch('/api/reviews', {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });

        if (res.ok) {
            setChatInputs((prev) => ({ ...prev, [reviewId]: '' }));
            fetchReviews();
        } else {
            const err = await res.json();
            alert(err.message || 'Помилка при надсиланні повідомлення');
        }
        } catch (e) {
        console.error('Send message error:', e);
        alert('Помилка мережі');
        }
    };

    const visibleReviews = showAll ? reviews : reviews.slice(0, 5);

    if (visibleReviews.length === 0) return <p>Відгуків ще немає</p>;

    return (
        <>
        {visibleReviews.map((review) => {
            const canUserWriteMessage =
            user &&
            (user.role === 'manager' || user.role === 'admin' || String(user.id) === String(review.user_id));

            const canUserManageReview =
            user &&
            ((user.role === 'manager' || user.role === 'admin') || String(user.id) === String(review.user_id));

            return (
                <div key={review.id} className={styles.reviewItem}>
                    <div className={styles.nameBlock}>
                        <p className={styles.reviewName}>
                        {review.User?.first_name} {review.User?.last_name}
                        </p>{' '}
                        — {new Date(review.created_at).toLocaleDateString()}
                    </div>
                

                {editReviewId === review.id ? (
                <div>
                    <textarea
                    rows={3}
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                    className={styles.textarea}
                    />
                    <div className={styles.btnGroup}>
                    <button className={styles.btnPrimary} onClick={handleSaveEdit}>Зберегти</button>
                    <button className={styles.btnSecondary} onClick={cancelEdit}>Відмінити</button>
                    </div>
                </div>
                ) : (
                <>
                    <p className={styles.text}>{review.comment}</p>

                    {Array.isArray(review.messages) && review.messages.length > 0 && (
                    <div className={styles.chatWrapper}>
                        {review.messages.map((msg, i) => {
                        const canDeleteMessage =
                            user &&
                            ((user.role === 'manager' || user.role === 'admin') ||
                            (msg.sender === 'client' && String(user.id) === String(review.user_id)) ||
                            (msg.sender === 'staff' && (user.role === 'manager' || user.role === 'admin')));

                        return (
                            <div key={i} className={styles.chatMessage}>
                                <b>{msg.sender === 'staff' ? 'Менеджер' : `${review.User?.first_name} ${review.User?.last_name}`}: 
                                    <small>{new Date(msg.created_at).toLocaleString()}</small>
                                </b>
                            <p className={styles.text}>{msg.text}</p>    
                            
                            
                            {canDeleteMessage && (
                                <button
                                className={styles.btnDeleteMessage}
                                onClick={async () => {
                                    if (!confirm('Видалити це повідомлення?')) return;
                                    const token = localStorage.getItem('token');
                                    try {
                                    const res = await fetch('/api/reviews/message', {
                                        method: 'DELETE',
                                        headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: `Bearer ${token}`,
                                        },
                                        body: JSON.stringify({
                                        reviewId: review.id,
                                        messageIndex: i,
                                        }),
                                    });
                                    if (res.ok) {
                                        fetchReviews();
                                    } else {
                                        const err = await res.json();
                                        alert(err.message || 'Помилка при видаленні повідомлення');
                                    }
                                    } catch (e) {
                                    console.error('Delete message error:', e);
                                    alert('Помилка мережі');
                                    }
                                }}
                                >
                                Видалити повідомлення
                                </button>
                            )}
                            </div>
                        );
                        })}
                    </div>
                    )}

                    {canUserWriteMessage && (
                    <div className={styles.newMessageForm}>
                        <textarea
                        rows={2}
                        placeholder="Написати повідомлення"
                        value={chatInputs[review.id] || ''}
                        onChange={(e) =>
                            setChatInputs((prev) => ({
                            ...prev,
                            [review.id]: e.target.value,
                            }))
                        }
                        className={styles.textarea}
                        />
                        <button className={styles.btnPrimary} onClick={() => handleSendMessage(review.id)}>
                        Надіслати
                        </button>
                    </div>
                    )}

                    {canUserManageReview && (
                    <div className={styles.manageButtons}>
                        <button className={styles.btnSecondary} onClick={() => startEdit(review)}>
                        Редагувати
                        </button>
                        <button className={styles.btnDanger} onClick={() => handleDelete(review.id)}>
                        Видалити
                        </button>
                    </div>
                    )}
                </>
                )}
            </div>
            );
        })}
        </>
    );
}
