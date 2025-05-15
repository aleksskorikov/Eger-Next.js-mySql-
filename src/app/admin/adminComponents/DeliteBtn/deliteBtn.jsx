// import React from 'react';
// import styles from "./_deliteBtn.module.scss";

// const DeleteBtn = ({ productId, onDeleteSuccess }) => {

// const handleDelete = async () => {
//     if (window.confirm('Вы уверены, что хотите удалить этот товар?')) {
//         try {
//             const response = await fetch(`http://localhost:5001/api/products?id=${productId}`, {
//                 method: 'DELETE',
//             });
//             if (response.ok) {
//                 alert('Товар успешно удален.');
//                 onDeleteSuccess();
//             } else {
//                 alert('Ошибка при удалении товара.');
//             }
//         } catch (error) {
//             console.error('Ошибка при удалении товара:', error);
//             alert('Ошибка при удалении товара.');
//         }
//     }
// };
//     return (
//         <button onClick={handleDelete} className={styles.deleteButton}>Удалить товар</button>
//     );
// };

// export default DeleteBtn;


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
            {isDeleting ? 'Удаление...' : 'Удалить товар'}
        </button>
    );
};

export default DeleteBtn;






