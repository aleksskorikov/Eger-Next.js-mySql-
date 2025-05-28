'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './_search.module.scss';

const Search = () => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const timeoutRef = useRef(null);

    useEffect(() => {
        if (!query) {
        setSuggestions([]);
        return;
        }

        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(fetchSuggestions, 300);

        async function fetchSuggestions() {
        setLoading(true);
        try {
            const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
            const data = await res.json();
            if (res.ok) {
            setSuggestions(data.products || []);
            setShowDropdown(true);
            }
        } catch (err) {
            console.error('Помилка пошуку:', err);
        } finally {
            setLoading(false);
        }
        }
    }, [query]);

    const handleSelect = (product) => {
        setQuery(product.name);
        setShowDropdown(false);
        setSelectedProduct(product);
    };

    return (
        <div className={styles.container}>
        <input
            type="text"
            placeholder="Пошук по назві або артикулу..."
            value={query}
            onChange={(e) => {
            setQuery(e.target.value);
            setSelectedProduct(null);
            }}
            onFocus={() => setShowDropdown(true)}
            className={styles.input}
        />

        {showDropdown && suggestions.length > 0 && (
            <ul className={styles.dropdown}>
            {suggestions.map((product) => (
                <li
                key={product.id}
                onClick={() => handleSelect(product)}
                className={styles.suggestion}
                >
                <span>{product.name}</span> <small>#{product.article}</small>
                </li>
            ))}
            </ul>
        )}

        {loading && <div className={styles.loading}>Завантаження...</div>}

        {selectedProduct && (
            <div className={styles.selectedProduct}>
            <h2>{selectedProduct.name}</h2>
            <p>{selectedProduct.description || 'Немає опису для цього товару'}</p>

            {selectedProduct.ProductImages?.length > 0 ? (
                <div className={styles.imageSlider}>
                {selectedProduct.ProductImages.map((img, i) => (
                    <img
                    key={i}
                    src={img.image_url || '/images/hanter-foto/imgAlt.jpg'}
                    alt={`${selectedProduct.name} - ${i + 1}`}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/hanter-foto/imgAlt.jpg';
                    }}
                    className={styles.productImage}
                    />
                ))}
                </div>
            ) : (
                <img
                src="/images/hanter-foto/imgAlt.jpg"
                alt="Нет изображения"
                className={styles.productImage}
                />
            )}

            {selectedProduct.ProductDescriptions?.length > 0 && (
                <ol className={styles.productDescriptions}>
                {selectedProduct.ProductDescriptions
                    .sort((a, b) => a.description_order - b.description_order)
                    .map((desc, idx) => (
                    <li key={idx}>{desc.description_text}</li>
                    ))}
                </ol>
            )}

            <p>Артикул: #{selectedProduct.article}</p>
            <p>
                {selectedProduct.isOnSale && selectedProduct.sale_price ? (
                <>
                    <span className={styles.salePrice}>🔥Ціна по акції: {selectedProduct.sale_price} грн</span>{' '}
                    <span className={styles.originalPrice}><s>{selectedProduct.price} грн</s></span>
                </>
                ) : (
                <>Ціна: {selectedProduct.price} грн</>
                )}
            </p>
            </div>
        )}
        </div>
    );
};

export default Search;

