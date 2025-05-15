"use client";

import React, { useState, useEffect } from "react";
import Hanter from "../adminComponents/MenuComponents/hanter";
import Fishing from "../adminComponents/MenuComponents/fishing";
import Weapon from "../adminComponents/MenuComponents/weapon";
import Tourizm from "../adminComponents/MenuComponents/tourizm";
import styles from "./_adminProducts.module.scss";
import useFetchProducts from "../../Hooks/useFetchProducts";
import FilteredProducts from "../adminComponents/FilteredProducts/filteredProducts";
import AddProductBtn from "../adminComponents/AddProductBtn/addProductBtn";


const Admin = () => {
    const { products, error, fetchProducts } = useFetchProducts();
    const [selectedCategory, setSelectedCategory] = useState({
        category: null,
        name: null,
    });
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        if (selectedCategory.category && products.length > 0) {
            const filtered = products.filter((product) => {
                const productCategoryId = parseInt(product.category_id, 10);
                const selectedCategoryId = parseInt(selectedCategory.category, 10);      
                return productCategoryId === selectedCategoryId;
            });
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts([]);
        }
    }, [selectedCategory, products]);

    const handleCategoryClick = (id, name) => {
        setSelectedCategory({
            category: id,
            name: name,
        });
    };

    const handleAddProduct = async (formData) => {
        if (!selectedCategory?.category) {
            throw new Error("Категория не выбрана!");
        }

        formData.append("category_id", selectedCategory.category);
        formData.append("page_name", selectedCategory.name || "default_page");

        const response = await fetch('/api/products', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Ошибка при добавлении продукта");
        }

        await fetchProducts();
    };

    const handleProductUpdate = (updatedProduct) => {
        setFilteredProducts(prevProducts =>
            prevProducts.map(product =>
                product.id === updatedProduct.id ? updatedProduct : product
            )
        );
    };

    return (
        <div className={styles.main}>
            <div className={styles.container}>
                <section className={styles.sections}>
                    <Hanter onCategoryClick={handleCategoryClick} />
                    <Fishing onCategoryClick={handleCategoryClick} />
                    <Weapon onCategoryClick={handleCategoryClick} />
                    <Tourizm onCategoryClick={handleCategoryClick} />
                </section>
                <section className={styles.adminBlock}>
                    <div>
                        {selectedCategory.category ? (
                            <>
                                {error && <p className={styles.error}>{error}</p>}
                                <FilteredProducts 
                                    products={filteredProducts} 
                                    selectedCategory={selectedCategory} 
                                    onProductUpdate={handleProductUpdate}
                                />
                                <AddProductBtn 
                                    onAddProduct={handleAddProduct} 
                                    selectedCategory={selectedCategory} 
                                />
                            </>
                        ) : (
                            <div>
                                <p className={styles.message}>Выберите категорию</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
        
    );
};

export default Admin;