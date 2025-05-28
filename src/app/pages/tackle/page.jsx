"use client";
import React, { useState, useEffect } from 'react';
import OllAll from '../../../components/OllAll/OllAll';
import ProductCard from '../../../components/ProductCard/ProductCard';
import Menu from '../../../components/Menu/Menu';
import useFetchProducts from '../../Hooks/useFetchProducts';
import styles from '../_productPages.module.scss';
import Pagination from '../../../components/Pagination/page.jsx';
import useFilteredPaginatedProducts from '../../Hooks/useFilteredPaginatedProducts'; 
import PagesTop from '../../../components/PagesTop/pagesTop';

import MenuImg from "../../../../public/images/menu img/tackle.jpg";
import MenuImg1 from "../../../../public/images/menu img/tackle1.jpg";
import MenuImg2 from "../../../../public/images/menu img/tackle2.jpg";
import MenuImg3 from "../../../../public/images/menu img/tackle3.jpg";
import MenuImg4 from "../../../../public/images/menu img/tackle4.jpg";
import MenuImg5 from "../../../../public/images/menu img/tackle5.jpg";
import MenuImg6 from "../../../../public/images/menu img/tackle6.jpg";
import MenuImg7 from "../../../../public/images/menu img/tackle7.jpg";
import topImage from "../../../../public/images/pages-img/tacle.jpg";

const Tackle = () => {
    const [activeMenuOne, setActiveMenuOne] = useState('all');
    const itemsPerPage = 8;
    const pageName = 'tackle';

    const menuItemsOne = [
        { img: MenuImg, id: 'all', name: 'Всі снасті' },
        { img: MenuImg1, id: '60', name: 'Готові монтажі' },
        { img: MenuImg2, id: '61', name: 'Гачки' },
        { img: MenuImg3, id: '62', name: 'Грузила' },
        { img: MenuImg4, id: '63', name: 'Джиг - головки' },
        { img: MenuImg5, id: '64', name: 'Годівниці' },
        { img: MenuImg6, id: '65', name: 'Поплавки' },
        { img: MenuImg7, id: '66', name: 'Карабіни та застібки' }
    ];

    const { products: allProducts, error, loading } = useFetchProducts();
    const products = allProducts || [];
    const categoriesOne = [60, 61, 62, 63, 64, 65, 66];

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
                <h1 className={styles.menuTitle}>Снасті</h1>
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

export default Tackle;

