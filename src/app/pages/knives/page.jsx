'use client';

import React, { useState, useEffect } from 'react';
import OllAll from '../../../components/OllAll/OllAll';
import ProductCard from '../../../components/ProductCard/ProductCard';
import Menu from '../../../components/Menu/Menu';
import useFetchProducts from '../../Hooks/useFetchProducts';
import Pagination from '../../../components/Pagination/page.jsx';
import styles from '../_productPages.module.scss';
import useFilteredPaginatedProducts from '../../Hooks/useFilteredPaginatedProducts';
import PagesTop from '../../../components/PagesTop/pagesTop';

import MenuImg from "../../../../public/images/menu img/knives.jpg";
import MenuImg1 from "../../../../public/images/menu img/knives1.jpg";
import MenuImg2 from "../../../../public/images/menu img/knives2.jpg";
import MenuImg3 from "../../../../public/images/menu img/knives3.jpg";
import MenuImg4 from "../../../../public/images/menu img/knives4.jpg";
import MenuImg5 from "../../../../public/images/menu img/knives5.jpg";
import topImage from "../../../../public/images/pages-img/guns1.jpg";

const Knives = () => {
    const [activeMenuOne, setActiveMenuOne] = useState('all');
    const itemsPerPage = 8;
    const pageName = 'knives';

    const menuItemsOne = [
        { img: MenuImg, id: 'all', name: 'Всі ножі' },
        { img: MenuImg1, id: '21', name: 'Ножі з фіксованим клинком' },
        { img: MenuImg2, id: '22', name: 'Складні ножі' },
        { img: MenuImg3, id: '23', name: 'Тренувальна зброя' },
        { img: MenuImg4, id: '24', name: 'Комплектуючі для ножів' },
        { img: MenuImg5, id: '25', name: 'Точильні пристрої' }
    ];

    const { products: allProducts, error, loading } = useFetchProducts();
    const products = allProducts || [];
    const categoriesOne = [21, 22, 23, 24, 25];

    const {
        paginatedProducts: filteredProducts,
        currentPage,
        totalPages,
        handlePageChange,
    } = useFilteredPaginatedProducts(products, categoriesOne, activeMenuOne, itemsPerPage);

    useEffect(() => {
        handlePageChange('reset');
    }, [activeMenuOne]);

    if (loading) return <div>Завантаження товарів...</div>;
    if (error) return <div>Помилка при завантаженні товарів: {error.message}</div>;

    return (
        <div className={styles.container}>
            <PagesTop  topImage={topImage}/>
            <div className={styles.menu}>
                <h1 className={styles.menuTitle}>Ножі</h1>
                <Menu
                    menuItems={menuItemsOne}
                    activeMenu={activeMenuOne}
                    onMenuItemClick={setActiveMenuOne}
                />
                <div className={styles.productsList}>
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                pageName={pageName}
                            />
                        ))
                    ) : (
                        <p className={styles.paginationText}>На жаль поки немає товарів в даній категорії</p>
                    )}
                </div>
                <Pagination 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    onPageChange={handlePageChange} 
                />
            </div>
            <OllAll />
        </div>
    );
};

export default Knives;


