"use client";
import React, { useState, useEffect } from 'react';
import OllAll from '../../../components/OllAll/OllAll';
import ProductCard from '../../../components/ProductCard/ProductCard';
import Menu from '../../../components/Menu/Menu';
import useFetchProducts from '../../Hooks/useFetchProducts';
import styles from '../_productPages.module.scss';
import useFilteredPaginatedProducts from '../../Hooks/useFilteredPaginatedProducts';
import Pagination from '../../../components/Pagination/page.jsx'; 
import PagesTop from '../../../components/PagesTop/pagesTop';
import Loader from '../../../components/Loader/Loader';

import MenuImg from "../../../../public/images/menu img/thermal underwear.jpg";
import MenuImg1 from "../../../../public/images/menu img/thermal underwear1.jpg";
import MenuImg2 from "../../../../public/images/menu img/thermal underwear2.jpg";
import MenuImg3 from "../../../../public/images/menu img/thermal underwear3.jpg";
import MenuImg4 from "../../../../public/images/menu img/thermal underwear4.jpg";
import MenuImg5 from "../../../../public/images/menu img/thermal underwear5.jpg";
import MenuImg6 from "../../../../public/images/menu img/thermal underwear6.jpg";
import topImage from "../../../../public/images/pages-img/thermalUnderwear.jpeg";

const TthermalUnderwear = () => {
    const [activeMenuOne, setActiveMenuOne] = useState('all');
    const itemsPerPage = 8;
    const pageName = 'termal-underwear';

    const menuItemsOne = [
        { img: MenuImg, id: 'all', name: 'Вся Термобілизна' },
        { img: MenuImg1, id: '87', name: 'Термобілизна' },
        { img: MenuImg2, id: '88', name: 'Шкарпетки' },
        { img: MenuImg3, id: '89', name: 'Головні убори' },
        { img: MenuImg4, id: '90', name: 'Нашивки' },
        { img: MenuImg5, id: '91', name: 'Рукавички' },
        { img: MenuImg6, id: '92', name: 'Пояси' }
    ];

    const { products: allProducts, error, loading } = useFetchProducts();
    const products = allProducts || [];
    const categoriesOne = [87, 88, 89, 90, 91, 92];

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

    return (
        <div className={styles.container}>
            <PagesTop topImage={topImage}/>
            <div className={styles.menu}>
                <h1 className={styles.menuTitle}>Термобілизна</h1>
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

export default TthermalUnderwear;



