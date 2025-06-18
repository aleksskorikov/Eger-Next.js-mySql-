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

import MenuImg from "../../../../public/images/menu img/tool.jpg";
import MenuImg1 from "../../../../public/images/menu img/tool1.jpg";
import MenuImg2 from "../../../../public/images/menu img/tool2.jpg";
import MenuImg3 from "../../../../public/images/menu img/tool3.jpg";
import MenuImg4 from "../../../../public/images/menu img/tool4.jpg";
import MenuImg5 from "../../../../public/images/menu img/tool5.jpg";
import MenuImg6 from "../../../../public/images/menu img/tool6.jpg";
import topImage from "../../../../public/images/pages-img/guns1.jpg";

const Tool = () => {
    const [activeMenuOne, setActiveMenuOne] = useState('all');
    const itemsPerPage = 8;
    const pageName = 'tool';

    const menuItemsOne = [
        { img: MenuImg, id: 'all', name: 'Весь Інстремент' },
        { img: MenuImg1, id: '110', name: 'Мультитули' },
        { img: MenuImg2, id: '111', name: 'Мочете' },
        { img: MenuImg3, id: '112', name: 'Тапори' },
        { img: MenuImg4, id: '113', name: 'Лопати' },
        { img: MenuImg5, id: '114', name: 'Пили' },
        { img: MenuImg6, id: '115', name: 'Спецінструмент' }
    ];

    const { products: allProducts, error, loading } = useFetchProducts();
    const products = allProducts || [];
    const categoriesOne = [110, 111, 112, 113, 114, 115];

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
                <h1 className={styles.menuTitle}>Інстремент</h1>
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

export default Tool;

