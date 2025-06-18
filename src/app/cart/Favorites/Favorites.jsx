'use client';

import React, { useEffect, useState } from 'react';
import styles from './_favorites.module.scss';
import ProductCard from '../../../components/ProductCard/ProductCard';
import BuyBtn from '../../../components/btns/BuyBtn/buyBtn';
import RemoveFavoriteBtn from '../../../components/btns/RemoveFavoriteBtn/RemoveFavoriteBtn';
import Loader from '../../../components/Loader/Loader';


const Favorites = () => {
  const [favoritesIds, setFavoritesIds] = useState([]);
  const [favoritesData, setFavoritesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [removingIds, setRemovingIds] = useState([]);

  useEffect(() => {
    const storedIds = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavoritesIds(storedIds);
  }, []);

  useEffect(() => {
    if (favoritesIds.length === 0) {
      setFavoritesData([]);
      return;
    }

    setLoading(true);

    fetch('/api/products?ids=' + favoritesIds.join(','))
      .then(res => res.json())
      .then(data => {
        setFavoritesData(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [favoritesIds]);

  const handleRemove = (productId) => {
    setRemovingIds(prev => [...prev, productId]);

    setTimeout(() => {
      const stored = JSON.parse(localStorage.getItem('favorites')) || [];
      const updated = stored.filter(id => id !== productId);
      localStorage.setItem('favorites', JSON.stringify(updated));

      setFavoritesIds(prev => prev.filter(id => id !== productId));
      setRemovingIds(prev => prev.filter(id => id !== productId));
    }, 400);
  };


  if (loading) return <Loader/>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Обране</h2>
      {favoritesData.length === 0 ? (
        <p className={styles.empty}>Список обраного порожній 😞</p>
      ) :
      (
        <div className={styles.grid}>
          {favoritesData.map(product => (
            <div
              key={product.id}
              className={`${styles.cardWrapper} ${removingIds.includes(product.id) ? styles.removing : ''}`}
            >
              <ProductCard product={product} />
              <div className={styles.buttons}>
                <BuyBtn product={product} />
                <RemoveFavoriteBtn productId={product.id} onRemove={handleRemove} />
              </div>
            </div>
          ))}
        </div>
      // ) : (
      //   <div className={styles.grid}>
      //     {favoritesData.map(product => (
      //       <div key={product.id} className={styles.cardWrapper}>
      //         <ProductCard product={product} />
      //         <div className={styles.buttons}>
      //           <BuyBtn product={product} />
      //           <RemoveFavoriteBtn productId={product.id} onRemove={handleRemove} />
      //         </div>
      //       </div>
      //     ))}
      //   </div>
      )}
    </div>
  );
};

export default Favorites;




