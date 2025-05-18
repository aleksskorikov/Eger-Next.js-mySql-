'use client';
import React from 'react';
import ProductsAnaliticts from "./ProductsAnalytics/ProductAnalytics";
import ManagerAnalytics from './ManagerAnalytics/ManagerAnalytics';
import styles from "./_analitycs.module.scss"

export const Analitycs = () => {
    return (
        <div className={styles.main}>
            <ProductsAnaliticts />
            <ManagerAnalytics/>
        </div>
    )
}

export default Analitycs;
