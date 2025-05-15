'use client';

import React from 'react';
import Link from 'next/link';
import styles from '../../AsideMenu/_asideMenu.module.scss';

const ToMainBtn = () => {
    return (
        <>
        <button className={styles.menuItem}>
            <Link href="/" className={styles.menuLink}>На головну</Link>
        </button>
        </>

    );
};

export default ToMainBtn;
