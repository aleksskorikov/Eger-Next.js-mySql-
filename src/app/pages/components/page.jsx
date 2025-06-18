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
import Loader from '../../../components/Loader/Loader';

import MenuImg from "../../../../public/images/menu img/care.jpg";
import MenuImg1 from "../../../../public/images/menu img/components1.jpg";
import MenuImg2 from "../../../../public/images/menu img/components2.jpg";
import MenuImg3 from "../../../../public/images/menu img/components3.jpg";
import MenuImg4 from "../../../../public/images/menu img/components4.jpg";
import MenuImg5 from "../../../../public/images/menu img/components5.jpg";
import topImage from "../../../../public/images/pages-img/guns1.jpg";

const Components = () => {
    const [activeMenuOne, setActiveMenuOne] = useState('all');
    const itemsPerPage = 8;
    const pageName = 'components';

    const menuItemsOne = [
        { img: MenuImg, id: 'all', name: 'Всі комплектуючі' },
        { img: MenuImg1, id: '105', name: 'Комплектуючі до зброї' },
        { img: MenuImg2, id: '106', name: 'Кріплення для оптики' },
        { img: MenuImg3, id: '107', name: 'Травмотичній зброї' },
        { img: MenuImg4, id: '108', name: 'Пневматичній зброї' },
        { img: MenuImg5, id: '109', name: 'Мітальній зброї' }
    ];

    const { products: allProducts, error, loading } = useFetchProducts();
    const products = allProducts || [];
    const categoriesOne = [105, 106, 107, 108, 109];

    const {
        paginatedProducts: filteredProducts,
        currentPage,
        totalPages,
        handlePageChange,
    } = useFilteredPaginatedProducts(products, categoriesOne, activeMenuOne, itemsPerPage);

    useEffect(() => {
        handlePageChange('reset');
    }, [activeMenuOne]);

    if (loading) return <Loader/>;
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
                <h1 className={styles.menuTitle}>Комплектуючі</h1>
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

export default Components;


