'use client';

import React, { useState, useEffect } from 'react';
import styles from './_addToFavorites.module.scss';

const AddToFavorites = ({ product }) => {
    const [isFavorited, setIsFavorited] = useState(false);
    
    useEffect(() => {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setIsFavorited(favorites.includes(product.id));
      }, [product.id]);
      

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  
    if (isFavorited) {
      const updated = favorites.filter(id => id !== product.id);
      localStorage.setItem('favorites', JSON.stringify(updated));
      setIsFavorited(false);
    } else {
      favorites.push(product.id);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      setIsFavorited(true);
    }
  };
  

  return (
    <button
      className={`${styles.button} ${isFavorited ? styles.active : ''}`}
      onClick={toggleFavorite}
    >
      {isFavorited ? '💖 У вибраному' : '🤍 В обране'}
    </button>
  );
};

export default AddToFavorites;





