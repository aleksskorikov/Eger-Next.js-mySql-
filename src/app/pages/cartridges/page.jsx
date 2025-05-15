'use client';

import React, { useState, useEffect } from 'react';
import OllAll from '../../../components/OllAll/OllAll';
import ProductCard from '../../../components/ProductCard/ProductCard';
import Menu from '../../../components/Menu/Menu'; 
import Pagination from '../../../components/Pagination/page.jsx'; 
import styles from '../_productPages.module.scss';
import useFetchProducts from '../../Hooks/useFetchProducts';
import useFilteredPaginatedProducts from '../../Hooks/useFilteredPaginatedProducts';
import PagesTop from '../../../components/PagesTop/pagesTop'; 

import MenuImg from '../../../../public/images/menu img/patrons.jpg';
import MenuImg1 from '../../../../public/images/menu img/patrons1.jpg';
import MenuImg2 from '../../../../public/images/menu img/patrons2.jpg';
import MenuImg3 from '../../../../public/images/menu img/patrons3.jpg';
import MenuImg4 from '../../../../public/images/menu img/patrons4.jpg';
import MenuImg5 from '../../../../public/images/menu img/patrons5.jpg';
import topImage from '../../../../public/images/pages-img/patron2.jpg';

const Cartridges = () => {
    const [activeMenuOne, setActiveMenuOne] = useState('all');
    const itemsPerPage = 8;
    const pageName = 'cartridges';

    const menuItemsOne = [
        { img: MenuImg, id: 'all', name: 'Всі патрони' },
        { img: MenuImg1, id: '8', name: 'Дробові патрони' },
        { img: MenuImg2, id: '9', name: 'Картеч' },
        { img: MenuImg3, id: '10', name: 'Кульові патрони' },
        { img: MenuImg4, id: '11', name: 'Нарізні' },
        { img: MenuImg5, id: '12', name: 'Гладкоствольні' }
    ];

    const { products: allProducts, error, loading } = useFetchProducts();
    const products = allProducts || [];
    const categoriesOne = [8, 9, 10, 11, 12];

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
                <h1 className={styles.menuTitle}>Патрони</h1>
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

export default Cartridges;







