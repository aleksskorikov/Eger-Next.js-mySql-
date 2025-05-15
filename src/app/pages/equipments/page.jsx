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

import MenuImg from "../../../../public/images/menu img/equipments.jpg";
import MenuImg1 from "../../../../public/images/menu img/equipments1.jpg";
import MenuImg2 from "../../../../public/images/menu img/equipments2.jpg";
import MenuImg3 from "../../../../public/images/menu img/equipments3.jpg";
import MenuImg4 from "../../../../public/images/menu img/equipments4.jpg";
import MenuImg5 from "../../../../public/images/menu img/equipments5.jpg";
import MenuImg6 from "../../../../public/images/menu img/equipments6.jpg";
import MenuImg7 from "../../../../public/images/menu img/equipments7.jpg";
import MenuImg8 from "../../../../public/images/menu img/equipments8.jpg";
import topImage from "../../../../public/images/pages-img/guns1.jpg";

const Equipments = () => {
    const [activeMenuOne, setActiveMenuOne] = useState('all');
    const itemsPerPage = 8;
    const pageName = 'equipments';

    const menuItemsOne = [
        { img: MenuImg, id: 'all', name: 'Все Екіпірування' },
        { img: MenuImg1, id: '116', name: 'Розвантажувальні та бронежелети' },
        { img: MenuImg2, id: '117', name: 'Страхувальні желети' },
        { img: MenuImg3, id: '118', name: 'Бронепластини' },
        { img: MenuImg4, id: '119', name: 'Шоломи' },
        { img: MenuImg5, id: '120', name: 'Налокітники та наколінники' },
        { img: MenuImg6, id: '121', name: 'Навушники та беруші' },
        { img: MenuImg7, id: '122', name: 'Окуляри' },
        { img: MenuImg8, id: '123', name: 'Підсумки' }
    ];

    const { products: allProducts, error, loading } = useFetchProducts();
    const products = allProducts || [];
    const categoriesOne = [116, 117, 118, 119, 120, 121, 122, 123];

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

    const asideMenuItems = [
        { title: 'Зброя', link: '/pages/gan' },
        { title: 'Набої', link: '/pages/bullets' },
        { title: 'Аксесуари', link: '/pages/acces' },
        { title: 'Комплектуючі', link: '/pages/components' },
        { title: 'Екіпірування', link: '/pages/equipments' },
        { title: 'Інстремент', link: '/pages/tool' },
        { title: 'Засоби самозахисту', link: '/pages/means' },
        { title: 'Термобілизна', link: '/pages/thermal-underwear' },
        { title: 'Ножи', link: '/pages/knives' },
    ]
    return (
        <div className={styles.container}>
            <PagesTop asideMenuItems={asideMenuItems} topImage={topImage}/>
            <div className={styles.menu}>
                <h1 className={styles.menuTitle}>Екіпірування</h1>
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

export default Equipments;

