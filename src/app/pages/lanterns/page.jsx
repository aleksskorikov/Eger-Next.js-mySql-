'use client';

import React, { useState, useEffect } from 'react';
import OllAll from '../../../components/OllAll/OllAll';
import ProductCard from '../../../components/ProductCard/ProductCard';
import Menu from '../../../components/Menu/Menu';
import useFetchProducts from '../../Hooks/useFetchProducts';
import styles from '../_productPages.module.scss';
import Pagination from '../../../components/Pagination/page.jsx'; 
import useFilteredPaginatedProducts from '../../Hooks/useFilteredPaginatedProducts'; 
import PagesTop from '../../../components/PagesTop/pagesTop';

import MenuImg from "../../../../public/images/menu img/lanterns.jpg";
import MenuImg1 from "../../../../public/images/menu img/lanterns1.jpg";
import MenuImg2 from "../../../../public/images/menu img/lanterns2.jpg";
import MenuImg3 from "../../../../public/images/menu img/lanterns3.jpg";
import MenuImg4 from "../../../../public/images/menu img/lanterns4.jpg";
import MenuImg5 from "../../../../public/images/menu img/lanterns5.jpg";
import MenuImg6 from "../../../../public/images/menu img/lanterns6.jpg";
import topImage from "../../../../public/images/pages-img/lanterns.webp";

const Lanterns = () => {
    const [activeMenuOne, setActiveMenuOne] = useState('all');
    const itemsPerPage = 8;
    const pageName = 'lanterns';

    const menuItemsOne = [
        { img: MenuImg, id: 'all', name: 'Всі Ліхтарі' },
        { img: MenuImg1, id: '81', name: 'Комплектуючі для ліхтарів' },
        { img: MenuImg2, id: '82', name: 'Налобні ліхтарі' },
        { img: MenuImg3, id: '83', name: 'Ручні ліхтарі' },
        { img: MenuImg4, id: '84', name: 'Кемпенгові ліхтарі' },
        { img: MenuImg5, id: '85', name: 'Ліхтарі зброї' },
        { img: MenuImg6, id: '86', name: 'Елементи живлення' }
    ];

    const { products: allProducts, error, loading } = useFetchProducts();
    const products = allProducts || [];
    const categoriesOne = [81, 82, 83, 84, 85, 86];

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
                <h1 className={styles.menuTitle}>Ліхтарі</h1>
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

export default Lanterns;


