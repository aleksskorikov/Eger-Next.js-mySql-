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

import MenuImg from "../../../../public/images/menu img/lure.jpg";
import MenuImg1 from "../../../../public/images/menu img/lure1.jpg";
import MenuImg2 from "../../../../public/images/menu img/lure2.jpg";
import MenuImg3 from "../../../../public/images/menu img/lure3.jpg";
import MenuImg4 from "../../../../public/images/menu img/lure4.jpg";
import MenuImg5 from "../../../../public/images/menu img/lure5.jpg";
import MenuImg6 from "../../../../public/images/menu img/lure6.jpg";
import topImage from "../../../../public/images/pages-img/lure.jpg";


const Lure = () => {
    const [activeMenuOne, setActiveMenuOne] = useState('all');
    const itemsPerPage = 8;
    const pageName = 'lure';

    const menuItemsOne = [
        { img: MenuImg, id: 'all', name: 'Всі прикормки' },
        { img: MenuImg1, id: '67', name: 'Блешні' },
        { img: MenuImg2, id: '68', name: 'Балансири' },
        { img: MenuImg3, id: '69', name: 'Воблери' },
        { img: MenuImg4, id: '70', name: 'Силікон' },
        { img: MenuImg5, id: '71', name: 'Діпи' },
        { img: MenuImg6, id: '72', name: 'Прикормки' }
    ];

    const { products: allProducts, error, loading } = useFetchProducts();
    const products = allProducts || [];
    const categoriesOne = [67, 68, 69, 70, 71, 72];

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
        { title: 'Вудки', link: '/pages/fishing-rods' },
        { title: 'Котушки', link: '/pages/coils' },
        { title: 'Снасті', link: '/pages/tackle' },
        { title: 'Прикормки', link: '/pages/lure' },
        { title: 'Одяг', link: '/pages/cloth' },
        { title: 'Обладнання', link: '/pages/equipment' },
        { title: 'Ліхтарі', link: '/pages/lanterns' },
        { title: 'Термобілизна', link: '/pages/thermal-underwear' },
    ]
    return (
        <div className={styles.container}>
            <PagesTop asideMenuItems={asideMenuItems} topImage={topImage}/>
            <div className={styles.menu}>
                <h1 className={styles.menuTitle}>Прикормки</h1>
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

export default Lure;
