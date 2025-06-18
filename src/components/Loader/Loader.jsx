import React from 'react';
import styles from './_loader.module.scss';

const Loader = () => {
    return (
        <div className={styles.loaderBlock}>
            <p className={styles.loaderText}>Завантаження...</p>
            <div className={styles.loader}></div> 
        </div>
    )
}

export default Loader