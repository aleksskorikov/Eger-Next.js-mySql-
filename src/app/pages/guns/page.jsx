'use client';

import React, { useState, useEffect } from 'react';
import OllAll from '../../../components/OllAll/OllAll';
import ProductCard from '../../../components/ProductCard/ProductCard';
import Menu from '../../../components/Menu/Menu';
import useFetchProducts from '../../Hooks/useFetchProducts';
import Pagination from '../../../components/Pagination/page.jsx'; 
import styles from '../_productPages.module.scss';
import useFilteredPaginatedProducts from '../../Hooks/useFilteredPaginatedProducts.jsx';
import PagesTop from '../../../components/PagesTop/pagesTop';

import MenuImg from '../../../../public/images/menu img/gans.jpg';
import MenuImg1 from '../../../../public/images/menu img/gans1.jpg';
import MenuImg2 from '../../../../public/images/menu img/gans2.jpg';
import MenuImg3 from '../../../../public/images/menu img/gans3.jpg';
import MenuImg4 from '../../../../public/images/menu img/gans4.jpg';
import MenuImg5 from '../../../../public/images/menu img/gans5.jpg';
import MenuImg6 from '../../../../public/images/menu img/gans6.jpg';
import MenuImg7 from '../../../../public/images/menu img/guns7.jpg';
import topImage from "../../../../public/images/pages-img/guns1.jpg";

const Guns = () => {
    const [activeMenuOne, setActiveMenuOne] = useState('all');
    const [activeMenuTwo, setActiveMenuTwo] = useState('all');
    const itemsPerPage = 8;
    const pageName = 'guns';

    const menuItemsOne = [
        { img: MenuImg, id: 'all', name: 'Всі нарізні' },
        { img: MenuImg1, id: '1', name: 'Напівавтоматичні' },
        { img: MenuImg2, id: '2', name: 'Штуцери' },
        { img: MenuImg3, id: '3', name: 'З поздовжньо-ковзним затвором' },
        { img: MenuImg4, id: '4', name: 'Дрібнокаліберні' }
    ];

    const menuItemsTwo = [
        { img: MenuImg, id: 'all', name: 'Всі гладкоствольні' },
        { img: MenuImg7, id: '5', name: 'Переломні' },
        { img: MenuImg5, id: '6', name: 'Помпові' },
        { img: MenuImg6, id: '7', name: 'З продольно-ковзним затвором' }
    ];

    const { products: allProducts, error, loading } = useFetchProducts();
    const products = allProducts || [];
    const categoriesOne = [1, 2, 3, 4];
    const categoriesTwo = [5, 6, 7];

    
const {
    paginatedProducts: paginatedNarizni,
    currentPage: currentPageNarizni,
    totalPages: totalPagesNarizni,
    handlePageChange: handlePageChangeNarizni
} = useFilteredPaginatedProducts(
    products, 
    categoriesOne, 
    activeMenuOne, 
    itemsPerPage 
);

const {
    currentPage: currentPageGladkostvolni,
            totalPages: totalPagesGladkostvolni,
            paginatedProducts: paginatedGladkostvolni,
            handlePageChange: handlePageChangeGladkostvolni
} = useFilteredPaginatedProducts(
    products, 
    categoriesTwo, 
    activeMenuTwo, 
    itemsPerPage 
);


    if (loading) return <div>Завантаження товарів...</div>;
    if (error) return <div>Помилка при завантаженні товарів: {error.message}</div>;

    const asideMenuItems = [
        { title: 'Ружья', link: '/pages/guns' },
        { title: 'Патрони', link: '/pages/cartridges' },
        { title: 'Аксесуары', link: '/pages/accessories' },
        { title: 'Ножи', link: '/pages/knives' },
        { title: 'Одяг', link: '/pages/cloth' },
        { title: 'Догляд за зброєю', link: '/pages/care' },
        { title: 'Мисливськи аксесуари', link: '/pages/hunting-accessories' },
        { title: 'Стрилецьки аксесуари', link: '/pages/shooting-accessories' },
    ];

    return (
        <div className={styles.container}>
            <PagesTop asideMenuItems={asideMenuItems} topImage={topImage}/>
            <div className={styles.menu}>
                <h1 className={styles.menuTitle}>Ружья</h1>
                <h2 className={styles.menuSubtitle}>Нарізні</h2>
                <Menu
                    menuItems={menuItemsOne}
                    activeMenu={activeMenuOne}
                    onMenuItemClick={setActiveMenuOne}
                />
                <div className={styles.productsList}>
                    {paginatedNarizni.length > 0 ? (
                        paginatedNarizni.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                pageName={pageName}
                            />
                        ))
                    ) : (
                        <p className={styles.messageText}>На жаль поки немає товарів в даній категорії</p>
                    )}
                </div>
                <Pagination
                    currentPage={currentPageNarizni}
                    totalPages={totalPagesNarizni}
                    onPageChange={handlePageChangeNarizni}
                />

                <h2 className={styles.menuSubtitle}>Гладкоствольні</h2>
                <Menu
                    menuItems={menuItemsTwo}
                    activeMenu={activeMenuTwo}
                    onMenuItemClick={setActiveMenuTwo}
                />
                <div className={styles.productsList}>
                    {paginatedGladkostvolni.length > 0 ? (
                        paginatedGladkostvolni.map(product => (
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
                    currentPage={currentPageGladkostvolni}
                    totalPages={totalPagesGladkostvolni}
                    onPageChange={handlePageChangeGladkostvolni}
                />
            </div>
            <OllAll />
        </div>
    );
};

export default Guns;




