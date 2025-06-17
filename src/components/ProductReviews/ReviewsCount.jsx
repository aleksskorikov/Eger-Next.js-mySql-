import React from 'react';
import styles from './_productReviews.module.scss';

export default function ReviewsCount({ count }) {
    return (
        <span className={styles.count}>
            ({count})
        </span>
    );
}
