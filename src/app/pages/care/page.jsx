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

import MenuImg from "../../../../public/images/menu img/care.jpg";
import MenuImg1 from "../../../../public/images/menu img/care1.jpg";
import MenuImg2 from "../../../../public/images/menu img/care2.jpg";
import MenuImg3 from "../../../../public/images/menu img/care3.jpg";
import MenuImg4 from "../../../../public/images/menu img/care4.jpg";
import MenuImg5 from "../../../../public/images/menu img/care5.jpg";
import MenuImg6 from "../../../../public/images/menu img/care6.jpg";
import MenuImg7 from "../../../../public/images/menu img/care7.jpg";
import MenuImg8 from "../../../../public/images/menu img/care8.jpg";
import topImage from "../../../../public/images/pages-img/care.jpg";

const Care = () => {
    const [activeMenuOne, setActiveMenuOne] = useState('all');
    const itemsPerPage = 8;
    const pageName = 'care';

    const menuItemsOne = [
        { img: MenuImg, id: 'all', name: 'Чистка та догляд' },
        { img: MenuImg1, id: '34', name: 'Шомполи' },
        { img: MenuImg2, id: '35', name: 'Набори для чищення' },
        { img: MenuImg3, id: '36', name: 'Протяжки' },
        { img: MenuImg4, id: '37', name: 'Насадки' },
        { img: MenuImg5, id: '38', name: 'Направляючі' },
        { img: MenuImg6, id: '39', name: 'Засоби для чишення' },
        { img: MenuImg7, id: '40', name: 'Фарба' },
        { img: MenuImg8, id: '41', name: 'Інші аксесуари' },
    ];

    const { products: allProducts, error, loading } = useFetchProducts();
    const products = allProducts || [];
    const categoriesOne = [34, 35, 36, 37, 38, 39, 40, 41];

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
                <h1 className={styles.menuTitle}>Догляд за зброєю</h1>
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

export default Care;
