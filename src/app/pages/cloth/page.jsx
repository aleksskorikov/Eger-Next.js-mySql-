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

import MenuImg from '../../../../public/images/menu img/closAll.jpg';
import MenuImg1 from '../../../../public/images/menu img/clos.jpg';
import MenuImg2 from '../../../../public/images/menu img/clos1.jpg';
import MenuImg3 from '../../../../public/images/menu img/clos2.jpg';
import MenuImg4 from '../../../../public/images/menu img/clos3.jpg';
import MenuImg5 from '../../../../public/images/menu img/closs.jpg';
import MenuImg6 from '../../../../public/images/menu img/clos4.jpg';
import MenuImg7 from '../../../../public/images/menu img/clos5.jpg';
import MenuImg8 from '../../../../public/images/menu img/clos6.jpg';
import MenuImg9 from '../../../../public/images/menu img/clos8.jpg';
import topImage from "../../../../public/images/pages-img/guns1.jpg";

const Cloth = () => {
    const [activeMenuOne, setActiveMenuOne] = useState('all');
    const [activeMenuTwo, setActiveMenuTwo] = useState('all');
    const itemsPerPage = 8;
    const pageName = 'cloth';

    const menuItemsOne = [
        { img: MenuImg, id: 'all', name: 'Весь одяг' },
        { img: MenuImg1, id: '26', name: 'Куртки' },
        { img: MenuImg2, id: '27', name: 'Костюми' },
        { img: MenuImg3, id: '28', name: 'Футболки та джемпера' },
        { img: MenuImg4, id: '29', name: 'Штани та комбінезони' }
    ];

    const menuItemsTwo = [
        { img: MenuImg5, id: 'all', name: 'Все взуття' },
        { img: MenuImg6, id: '30', name: 'Черевики' },
        { img: MenuImg7, id: '31', name: 'Чоботи' },
        { img: MenuImg8, id: '32', name: 'Гумові чоботи' },
        { img: MenuImg9, id: '33', name: 'Заброди та комбінезони' }
    ];

    const { products: allProducts, error, loading } = useFetchProducts();
    const products = allProducts || [];

    const categoriesOne = [26, 27, 28, 29];
    const categoriesTwo = [30, 31, 32, 33];

const {
    paginatedProducts: paginatedCloth,
    currentPage: currentPageCloth,
    totalPages: totalPagesCloth,
    handlePageChange: handlePageChangeCloth
} = useFilteredPaginatedProducts(
    products, 
    categoriesOne, 
    activeMenuOne, 
    itemsPerPage 
);

const {
    paginatedProducts: paginatedShoes,
    currentPage: currentPageShoes,
    totalPages: totalPagesShoes,
    handlePageChange: handlePageChangeShoes
} = useFilteredPaginatedProducts(
    products, 
    categoriesTwo,
    activeMenuTwo, 
    itemsPerPage 
);



    if (loading) return <div>Завантаження товарів...</div>;
    if (error) return <div>Помилка при завантаженні товарів: {error.message}</div>;

    return (
        <div className={styles.container}>
            <PagesTop  topImage={topImage}/>
            <div className={styles.menu}>
                <h1 className={styles.menuTitle}>Одяг</h1>

                <h2 className={styles.menuSubtitle}>Верхній одяг</h2>
                <Menu
                    menuItems={menuItemsOne}
                    activeMenu={activeMenuOne}
                    onMenuItemClick={setActiveMenuOne}
                />
                <div className={styles.productsList}>
    {paginatedCloth.length > 0 ? (
        paginatedCloth.map(product => (
            <ProductCard key={product.id} product={product} pageName={pageName} />
        ))
    ) : (
        <p className={styles.messageText}>На жаль поки немає товарів в даній категорії</p>
    )}
</div>
<Pagination
    currentPage={currentPageCloth}
    totalPages={totalPagesCloth}
    onPageChange={handlePageChangeCloth}
/>

                <h2 className={styles.menuSubtitle}>Взуття</h2>
                <Menu
                    menuItems={menuItemsTwo}
                    activeMenu={activeMenuTwo}
                    onMenuItemClick={setActiveMenuTwo}
                />
               <div className={styles.productsList}>
    {paginatedShoes.length > 0 ? (
        paginatedShoes.map(product => (
            <ProductCard key={product.id} product={product} pageName={pageName} />
        ))
    ) : (
        <p className={styles.messageText}>На жаль поки немає товарів в даній категорії</p>
    )}
</div>
<Pagination
    currentPage={currentPageShoes}
    totalPages={totalPagesShoes}
    onPageChange={handlePageChangeShoes}
/>
            </div>
            <OllAll />
        </div>
    );
};

export default Cloth;


