'use client';

import React, { useState } from 'react';
import styles from "./_deliteBtn.module.scss";

const DeleteBtn = ({ productId, onDeleteSuccess }) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (isDeleting) return;

        const confirmDelete = window.confirm('Вы уверены, что хотите удалить этот товар?');
        if (!confirmDelete) return;

        setIsDeleting(true);
        try {
            const response = await fetch(`/api/products?id=${productId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Товар успешно удален.');
                if (onDeleteSuccess) onDeleteSuccess();
            } else {
                alert('Ошибка при удалении товара.');
            }
        } catch (error) {
            console.error('Ошибка при удалении товара:', error);
            alert('Ошибка при удалении товара.');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            className={styles.deleteButton}
            disabled={isDeleting}
        >
            {isDeleting ? 'Видалення...' : 'Видалити товар'}
        </button>
    );
};

export default DeleteBtn;






