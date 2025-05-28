"use client";

import React, { useState, useEffect } from "react";
import styles from "./_filteredProducts.module.scss";
import DeleteBtn from "../DeliteBtn/deliteBtn";
import EditProductForm from "../EditProductForm/EditProductForm";
import Image from "next/image";
import ProductAnalytics from "../../Analytics/ProductAnalitycs/ProductAnalitycs";

const FilteredProducts = ({ products, onProductUpdate }) => {
    const [productList, setProductList] = useState(products || []);
    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => {
        setProductList(products);
    }, [products]);

    if (!productList || !Array.isArray(productList)) {
        return <p>Товары не загружены или данные некорректны</p>;
    }

    if (productList.length === 0) {
        return <p>Товары не найдены</p>;
    }

    const handleEditClick = (product) => {
        setEditingProduct(product);
    };

    const handleDelete = (deletedProductId) => {
        setProductList((prev) => prev.filter(product => product.id !== deletedProductId));
    };

    const handleSave = (updatedProductResponse) => {
        const updatedProduct = updatedProductResponse.product;
        
        setProductList((prev) =>
            prev.map((product) =>
                product.id === updatedProduct.id ? updatedProduct : product
            )
        );
        setEditingProduct(null);
        if (onProductUpdate) {
            onProductUpdate(updatedProduct);
        }
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return '/images/no-image.jpg';
        return imagePath.startsWith('/uploads/') ? imagePath : `/uploads/${imagePath}`;
    };

    return (
        <div className={styles.productsContainer}>
            <h2 className={styles.title}>Отфильтрованные товары</h2>
            <div className={styles.productsGrid}>
                {productList.map((product, index) => {
                    if (!product || !product.name || !product.price) {
                        console.error("Некорректный продукт:", product);
                        return null;
                    }
                    
                    const productImages = product.ProductImages || [];

                    return (
                        <div key={index} className={styles.productCard}>
                            <h3 className={styles.productName}>{product.name}</h3>
                            <p className={styles.productsArticle}>Артикул: # {product.article}</p>
                            <div className={styles.imageSlider}>
                                {productImages.length > 0 ? (
                                    productImages.map((img, i) => (
                                        <div key={i} className={styles.imageWrapper}>
                                            <Image
                                                src={getImageUrl(img.image_url)}
                                                alt={`${product.name} - ${i + 1}`}
                                                width={150}
                                                height={150}
                                                className={styles.productImage}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = '/images/no-image.jpg';
                                                }}
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <div className={styles.imageWrapper}>
                                        <Image
                                            src="/images/no-image.jpg"
                                            alt="Нет изображения"
                                            width={250}
                                            height={300}
                                            className={styles.productImage}
                                        />
                                    </div>
                                )}
                            </div>

                            <p className={styles.productDescription}>{product.description || "Описание отсутствует"}</p>

                            <ol className={styles.productFeatures}>
                                {product.ProductDescriptions
                                    ?.sort((a, b) => a.description_order - b.description_order)
                                    .map((desc, i) => (
                                        <li key={i}>{desc.description_text}</li>
                                    ))}
                            </ol>

                            <p className={styles.productPrice}>
                                {product.isOnSale && product.sale_price ? (
                                    <>
                                    <span className={styles.salePrice}>Цена по акции: {product.sale_price} грн</span>{' '}
                                    <span className={styles.originalPrice}><s>{product.price} грн</s></span>
                                    </>
                                ) : (
                                    <>Цена: {product.price} грн</>
                                )}
                            </p>

                            <div className={styles.blockBtn}>
                                <button onClick={() => handleEditClick(product)} className={styles.changeBtn}>
                                    Изменить товар
                                </button>
                                <DeleteBtn productId={product.id} onDeleteSuccess={handleDelete} />
                            </div>

                            {editingProduct?.id === product.id && (
                                <EditProductForm
                                    product={editingProduct}
                                    onSave={handleSave}
                                    onCancel={() => setEditingProduct(null)} 
                                    imageIds={editingProduct.ProductImages?.map(img => img.id) || []}
                                />
                            )}
                            <ProductAnalytics productId={product.id} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FilteredProducts;



