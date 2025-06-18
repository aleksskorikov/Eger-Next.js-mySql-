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
import Loader from '../../../components/Loader/Loader';

import MenuImg from "../../../../public/images/menu img/shooting accessories.jpg";
import MenuImg1 from "../../../../public/images/menu img/shooting accessories1.jpg";
import MenuImg2 from "../../../../public/images/menu img/shooting accessories2.jpg";
import MenuImg3 from "../../../../public/images/menu img/shooting accessories3.jpg";
import topImage from "../../../../public/images/pages-img/shootingAccessories.jpg";

const ShootingAccessories = () => {
    const [activeMenuOne, setActiveMenuOne] = useState('all');
    const itemsPerPage = 8;
    const pageName = 'shooting_accessories';

    const menuItemsOne = [
        { img: MenuImg, id: 'all', name: 'Всі стрілецьки аксесуари' },
        { img: MenuImg1, id: '46', name: 'Мішені' },
        { img: MenuImg2, id: '47', name: 'Тарілки' },
        { img: MenuImg3, id: '48', name: 'Інше' }
    ];

    const { products: allProducts, error, loading } = useFetchProducts();
    const products = allProducts || [];
    const categoriesOne = [46, 47, 48];

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
                <h1 className={styles.menuTitle}>Стрілецьки аксесуари</h1>
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

export default ShootingAccessories;

