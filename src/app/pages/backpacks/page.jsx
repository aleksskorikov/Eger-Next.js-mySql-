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

import MenuImg from '../../../../public/images/menu img/backpacks.jpg';
import MenuImg1 from '../../../../public/images/menu img/backpacks1.jpg';
import MenuImg2 from '../../../../public/images/menu img/backpacks2.jpg';
import MenuImg3 from '../../../../public/images/menu img/backpacks3.jpg';
import MenuImg4 from '../../../../public/images/menu img/backpacks4.jpg';
import MenuImg5 from '../../../../public/images/menu img/backpacks5.jpg';
import topImage from "../../../../public/images/pages-img/guns1.jpg";

const Backpacks = () => {
    const [activeMenuOne, setActiveMenuOne] = useState('all');
    const pageName = 'backpacks';
    const itemsPerPage = 8;

    const menuItemsOne = [
        { img: MenuImg, id: 'all', name: 'Всі Сумки та рюкзаки' },
        { img: MenuImg1, id: '132', name: 'Сумки' },
        { img: MenuImg2, id: '133', name: 'Підсумки' },
        { img: MenuImg3, id: '134', name: 'Рюкзаки' },
        { img: MenuImg4, id: '135', name: 'Чохли для спорядження' },
        { img: MenuImg5, id: '136', name: 'Гермопродукція' }
    ];

    const { products: allProducts, error, loading } = useFetchProducts();
    const products = allProducts || [];
    const categoriesOne = [132, 133, 134, 135, 136];

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
        { title: 'Бівак', link: '/pages/bivouac' },
        { title: 'Сумки та рюкзаки', link: '/pages/backpacks' },
        { title: 'Кухня та посуд', link: '/pages/dishes' },
        { title: 'Одяг', link: '/pages/cloth' },
        { title: 'Термобілизна', link: '/pages/thermal-underwear' },
    ];
    return (
        <>
            <div className={styles.container}>
            <PagesTop asideMenuItems={asideMenuItems} topImage={topImage}/>
                <div className={styles.menu}>
                    <h1 className={styles.menuTitle}>Сумки та рюкзаки</h1>
                    <Menu
                        menuItems={menuItemsOne}
                        activeMenu={activeMenuOne}
                        onMenuItemClick={setActiveMenuOne}
                    />
                    
                    <div className={styles.productsList}>
                    {filteredProducts.length > 0 ? (
                        paginate(filteredProducts).map(product => (
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
        </>
    );
};

export default Backpacks;



