'use client';

import React, { useState, useEffect } from 'react';
import OllAll from '../../../components/OllAll/OllAll';
import ProductCard from '../../../components/ProductCard/ProductCard';
import Menu from '../../../components/Menu/Menu';
import styles from '../_productPages.module.scss';
import Pagination from '../../../components/Pagination/page.jsx'; 
import useFilteredPaginatedProducts from '../../Hooks/useFilteredPaginatedProducts'; 
import PagesTop from '../../../components/PagesTop/pagesTop';
import Loader from '../../../components/Loader/Loader';

import useFetchProducts from '../../Hooks/useFetchProducts';
import MenuImg from '../../../../public/images/menu img/bullets.jpg';
import MenuImg1 from '../../../../public/images/menu img/bullets1.jpg';
import MenuImg3 from '../../../../public/images/menu img/bullets3.jpg';
import MenuImg4 from '../../../../public/images/menu img/bullets4.jpg';
import MenuImg5 from '../../../../public/images/menu img/bullets5.jpg';
import topImage from "../../../../public/images/pages-img/guns1.jpg";

const Bullets = () => {
    const [activeMenuOne, setActiveMenuOne] = useState('all');
    const itemsPerPage = 8;
    const pageName = 'bullets';

    const menuItemsOne = [
        { img: MenuImg, id: 'all', name: 'Всі набої' },
        { img: MenuImg1, id: '98', name: 'Патрони' },
        { img: MenuImg3, id: '99', name: 'Пневматичні патрони' },
        { img: MenuImg4, id: '100', name: 'Патрони Флобера' },
        { img: MenuImg5, id: '101', name: 'Стріли' }
    ];

    const { products: allProducts, error, loading } = useFetchProducts();
    const products = allProducts || [];
    const categoriesOne = [98, 99, 100, 101];

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
                <h1 className={styles.menuTitle}>Набої</h1>
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
    );
};

export default Bullets;




