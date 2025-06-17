'use client';

import React from 'react';
import styles from './_removeFavoriteBtn.module.scss';

const RemoveFavoriteBtn = ({ productId, onRemove }) => {
  const handleClick = () => {
    const stored = JSON.parse(localStorage.getItem('favorites')) || [];
    const updated = stored.filter(id => id !== productId);
    localStorage.setItem('favorites', JSON.stringify(updated));
    onRemove(productId);
  };

  return (
    <button className={styles.removeBtn} onClick={handleClick}>
      Видалити
    </button>
  );
};

export default RemoveFavoriteBtn;
