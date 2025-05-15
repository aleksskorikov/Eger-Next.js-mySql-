'use client';

import { useState, useEffect, useCallback } from 'react';

const useFetchProducts = (id = null) => {
    const [products, setProducts] = useState([]);
    const [product, setProduct] = useState(null); 
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProducts = useCallback(async () => { 
        setLoading(true);
        try {
            let url = '/api/products';
            if (id) {
                url += `?id=${id}`; 
            }

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            if (id) {
                if (!data || !data.name || !data.price) {
                    throw new Error("Invalid product data received");
                }
                setProduct(data); 
            } else {
                setProducts(data); 
            }
        } catch (error) {
            console.error('Ошибка при получении товаров:', error);
            setError(error.message || 'Unknown error');
        } finally {
            setLoading(false);
        }
    }, [id]); 

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return { products, product, error, loading, fetchProducts }; 
};

export default useFetchProducts;







