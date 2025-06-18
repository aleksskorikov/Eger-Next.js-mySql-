'use client';

import React, { useState, useEffect } from 'react';
import OllAll from '../../../components/OllAll/OllAll';
import ProductCard from '../../../components/ProductCard/ProductCard';
import Menu from '../../../components/Menu/Menu';
import useFetchProducts from '../../Hooks/useFetchProducts';
import styles from '../_productPages.module.scss';
import useFilteredPaginatedProducts from '../../Hooks/useFilteredPaginatedProducts'; 
import Pagination from '../../../components/Pagination/page.jsx';
import PagesTop from '../../../components/PagesTop/pagesTop';
import Loader from '../../../components/Loader/Loader';

import MenuImg from "../../../../public/images/menu img/fishing rods.jpg";
import MenuImg1 from "../../../../public/images/menu img/fishing rods1.jpg";
import MenuImg2 from "../../../../public/images/menu img/fishing rods2.jpg";
import MenuImg3 from "../../../../public/images/menu img/fishing rods3.jpg";
import MenuImg4 from "../../../../public/images/menu img/fishing rods4.jpg";
import MenuImg5 from "../../../../public/images/menu img/fishing rods5.jpg";
import MenuImg6 from "../../../../public/images/menu img/fishing rods6.jpg";
import MenuImg7 from "../../../../public/images/menu img/fishing rods7.jpg";
import topImage from "../../../../public/images/pages-img/fishingRods.jpg";

const FishingRods = () => {
    const [activeMenuOne, setActiveMenuOne] = useState('all');
    const itemsPerPage = 8
    const pageName = 'fishing-rods';

    const menuItemsOne = [
        { img: MenuImg, id: 'all', name: 'Всі вудки' },
        { img: MenuImg1, id: '49', name: 'Спінінгові' },
        { img: MenuImg2, id: '50', name: 'Кастингові' },
        { img: MenuImg3, id: '51', name: 'Фідерні' },
        { img: MenuImg4, id: '52', name: 'Морські' },
        { img: MenuImg5, id: '53', name: 'Коропові' },
        { img: MenuImg6, id: '54', name: 'Поплавочні' },
        { img: MenuImg7, id: '55', name: 'Вершинки та камлі' }
    ];

    const { products: allProducts, error, loading } = useFetchProducts();
    const products = allProducts || [];
    const categoriesOne = [49, 50, 51, 52, 53, 54, 55];

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
                <h1 className={styles.menuTitle}>Вудки</h1>
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

export default FishingRods;

