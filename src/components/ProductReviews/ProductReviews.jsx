'use client';

import React, { useEffect, useState } from 'react';
import useAuthUser from '../../../pages/api/users/useAuthUser.js';

import ReviewList from './ReviewList.jsx';
import ReviewForm from './ReviewForm.jsx';
import ReviewsCount from './ReviewsCount.jsx';

import styles from './_productReviews.module.scss';

export default function ProductReviews({ productId }) {
    const user = useAuthUser();

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAll, setShowAll] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [isVisible, setIsVisible] = useState(false); 

    const fetchReviews = async () => {
        if (!productId) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/reviews/${productId}`, { cache: 'no-store' });
            const data = await res.json();
            const parsedData = data.map(review => ({
                ...review,
                messages: review.messages ? JSON.parse(review.messages) : [],
            }));
            setReviews(parsedData);
        } catch (error) {
            console.error('Fetch reviews error:', error);
            setReviews([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const toggleVisibility = () => {
        setIsVisible(prev => !prev);
    };

    return (
        <>
            <h3 className={styles.title} onClick={toggleVisibility} style={{ cursor: 'pointer' }}>
                Відгуки користувачів <ReviewsCount count={reviews.length} />
            </h3>

            {isVisible && (
                <div className={styles.ratingWrapper}>
                    {user && !showForm && (
                        <button className={styles.btnPrimary} onClick={() => setShowForm(true)}>
                            Залишити відгук
                        </button>
                    )}
                    {user && showForm && (
                        <ReviewForm
                            productId={productId}
                            onCancel={() => setShowForm(false)}
                            onSuccess={() => {
                                setShowForm(false);
                                fetchReviews();
                            }}
                        />
                    )}
                    {loading ? (
                        <p>Завантаження відгуків...</p>
                    ) : (
                        <>
                            <ReviewList
                                user={user}
                                reviews={reviews}
                                fetchReviews={fetchReviews}
                                showAll={showAll}
                                setShowAll={setShowAll}
                            />
                            {reviews.length > 5 && (
                                <button className={styles.btnSecondary} onClick={() => setShowAll(prev => !prev)}>
                                    {showAll ? 'Сховати' : 'Показати всі'}
                                </button>
                            )}
                        </>
                    )}
                </div>
            )}
        </>
    );
}
