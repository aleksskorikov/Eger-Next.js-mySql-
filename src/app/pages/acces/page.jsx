'use client';

import React, { useState, useEffect } from 'react';
import OllAll from '../../../components/OllAll/OllAll';
import ProductCard from '../../../components/ProductCard/ProductCard';
import Menu from '../../../components/Menu/Menu';
import Pagination from '../../../components/Pagination/page.jsx'; 
import useFetchProducts from '../../Hooks/useFetchProducts';
import useFilteredPaginatedProducts from '../../Hooks/useFilteredPaginatedProducts'; 
import styles from '../_productPages.module.scss';
import PagesTop from '../../../components/PagesTop/pagesTop';

import MenuImg from '../../../../public/images/menu img/acces.jpg';
import MenuImg1 from '../../../../public/images/menu img/acces1.jpg';
import MenuImg2 from '../../../../public/images/menu img/care2.jpg';
import MenuImg3 from '../../../../public/images/menu img/shooting accessories1.jpg';
import topImage from "../../../../public/images/pages-img/guns1.jpg";

const Acces = () => {
    const [activeMenuOne, setActiveMenuOne] = useState('all');
    const itemsPerPage = 8;
    const pageName = 'acces';

    const menuItemsOne = [
        { img: MenuImg, id: 'all', name: 'Всі Аксесуари' },
        { img: MenuImg1, id: '102', name: 'Зберігання та транспортування' },
        { img: MenuImg2, id: '103', name: 'Чищення та догляд' },
        { img: MenuImg3, id: '104', name: 'Стрілецькі аксесуари' }
    ];

    const { products: allProducts, error, loading } = useFetchProducts();
    const products = allProducts || [];

    const categoriesOne = [102, 103, 104];

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
                <h1 className={styles.menuTitle}>Аксесуари</h1>
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

export default Acces;




