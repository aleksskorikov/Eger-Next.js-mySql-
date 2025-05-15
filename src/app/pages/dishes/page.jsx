'use client';

import React, { useState, useEffect  } from 'react';
import OllAll from '../../../components/OllAll/OllAll';
import ProductCard from '../../../components/ProductCard/ProductCard';
import Menu from '../../../components/Menu/Menu';
import useFetchProducts from '../../Hooks/useFetchProducts';
import styles from '../_productPages.module.scss';
import Pagination from '../../../components/Pagination/page.jsx';
import useFilteredPaginatedProducts from '../../Hooks/useFilteredPaginatedProducts'; 
import PagesTop from '../../../components/PagesTop/pagesTop'; 

import MenuImg from "../../../../public/images/menu img/dishes.jpg";
import MenuImg1 from "../../../../public/images/menu img/dishes1.jpg";
import MenuImg2 from "../../../../public/images/menu img/dishes2.jpg";
import MenuImg3 from "../../../../public/images/menu img/dishes3.jpg";
import topImage from "../../../../public/images/pages-img/guns1.jpg";

const Dishes = () => {
    const [activeMenuOne, setActiveMenuOne] = useState('all');
    const itemsPerPage = 8;
    const pageName = 'dishes';

    const menuItemsOne = [
        { img: MenuImg, id: 'all', name: 'Кухня та посуд' },
        { img: MenuImg1, id: '137', name: 'Пальники' },
        { img: MenuImg2, id: '138', name: 'Термопродукція' },
        { img: MenuImg3, id: '139', name: 'Туристичний посуд' }
    ];

    const { products: allProducts, error, loading } = useFetchProducts();
    const products = allProducts || [];
    const categoriesOne = [137, 138, 139];

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
        { title: 'Бівак', link: '/pages/bivouac' },
        { title: 'Сумки та рюкзаки', link: '/pages/backpacks' },
        { title: 'Кухня та посуд', link: '/pages/dishes' },
        { title: 'Одяг', link: '/pages/cloth' },
        { title: 'Термобілизна', link: '/pages/thermal-underwear' },
    ];
    return (
        <div className={styles.container}>
            <PagesTop asideMenuItems={asideMenuItems} topImage={topImage}/>
            <div className={styles.menu}>
                <h1 className={styles.menuTitle}>Кухня та посуд</h1>
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

export default Dishes;


