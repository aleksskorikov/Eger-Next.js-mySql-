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

import MenuImg from '../../../../public/images/menu img/acsesuars.jpg';
import MenuImg1 from '../../../../public/images/menu img/acsesuars1.jpg';
import MenuImg2 from '../../../../public/images/menu img/acsesuars2.jpg';
import MenuImg3 from '../../../../public/images/menu img/acsesuars3.jpg';
import MenuImg4 from '../../../../public/images/menu img/acsesuars4.jpg';
import MenuImg5 from '../../../../public/images/menu img/acsesuars5.jpg';
import MenuImg6 from '../../../../public/images/menu img/acsesuars6.jpg';
import MenuImg7 from '../../../../public/images/menu img/acsesuars7.jpg';
import MenuImg8 from '../../../../public/images/menu img/acsesuars8.jpg';
import topImage from "../../../../public/images/pages-img/guns1.jpg";

const Accessories = () => {
    const [activeMenuOne, setActiveMenuOne] = useState('all');
    const itemsPerPage = 8;
    const pageName = 'accessories';

    const menuItemsOne = [
        { img: MenuImg, id: 'all', name: 'Всі аксесуари' },
        { img: MenuImg1, id: '13', name: 'Кейси' },
        { img: MenuImg2, id: '14', name: 'Чохли' },
        { img: MenuImg3, id: '15', name: 'Підсумки' },
        { img: MenuImg4, id: '16', name: 'Коробки для патронів' },
        { img: MenuImg5, id: '17', name: 'Обкладинки на документі' },
        { img: MenuImg6, id: '18', name: 'Патронташі' },
        { img: MenuImg7, id: '19', name: 'Фіксатори патронів' },
        { img: MenuImg8, id: '20', name: 'Ремені збройові' }
    ];

    const { products: allProducts, error, loading } = useFetchProducts();
    const products = allProducts || [];
    const categoriesOne = [13, 14, 15, 16, 17, 18, 19, 20];

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
        <>
            <div className={styles.container}>
            <PagesTop asideMenuItems={asideMenuItems} topImage={topImage}/>
                <div className={styles.menu}>
                    <h1 className={styles.menuTitle}>Аксесуари</h1>
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
        </>
    );
};

export default Accessories;


