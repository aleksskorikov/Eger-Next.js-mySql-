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

import MenuImg from '../../../../public/images/menu img/coils.jpg';
import MenuImg1 from '../../../../public/images/menu img/coils1.jpg';
import MenuImg2 from '../../../../public/images/menu img/coils2.jpg';
import MenuImg3 from '../../../../public/images/menu img/coils3.jpg';
import MenuImg4 from '../../../../public/images/menu img/coils4.jpg';
import topImage from "../../../../public/images/pages-img/coils.webp";

const Coils = () => {
    const [activeMenuOne, setActiveMenuOne] = useState('all');
    const itemsPerPage = 8;
    const pageName = 'coils';

    const menuItemsOne = [
        { img: MenuImg, id: 'all', name: 'Всі котушки' },
        { img: MenuImg1, id: '56', name: 'Безінерційні' },
        { img: MenuImg2, id: '57', name: 'Мультиплікаторні' },
        { img: MenuImg3, id: '58', name: 'Провідні' },
        { img: MenuImg4, id: '59', name: 'Додаткові шпулі' }
    ];

    const { products: allProducts, error, loading } = useFetchProducts();
    const products = allProducts || [];
    const categoriesOne = [56, 57, 58, 59];

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
                <h1 className={styles.menuTitle}>Котушки</h1>
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

export default Coils;

