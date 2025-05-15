import React from 'react';
import styles from './_pagination.module.scss';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    return (
        <div className={styles.pagination}>
            <button
                onClick={() => onPageChange('prev')}
                disabled={currentPage === 1}
                className={styles.paginationBtn}
            >
                Назад
            </button>
            <span className={styles.paginationText}>
                Страница {currentPage} из {totalPages}
            </span>
            <button
                onClick={() => onPageChange('next')}
                disabled={currentPage === totalPages}
                className={styles.paginationBtn}
            >
                Вперед
            </button>
        </div>
    );
};

export default Pagination;
