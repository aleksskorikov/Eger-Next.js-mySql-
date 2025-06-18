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
import Loader from '../../../components/Loader/Loader';

import MenuImg from "../../../../public/images/menu img/equipment.jpg";
import MenuImg1 from "../../../../public/images/menu img/equipment1.jpg";
import MenuImg2 from "../../../../public/images/menu img/equipment2.jpg";
import MenuImg3 from "../../../../public/images/menu img/equipment3.jpg";
import MenuImg4 from "../../../../public/images/menu img/equipment4.jpg";
import MenuImg5 from "../../../../public/images/menu img/equipment5.jpg";
import MenuImg6 from "../../../../public/images/menu img/equipment6.jpg";
import MenuImg7 from "../../../../public/images/menu img/equipment7.jpg";
import MenuImg8 from "../../../../public/images/menu img/equipment8.jpg";
import topImage from "../../../../public/images/pages-img/equipment.jpg";

const Equipment = () => {
    const [activeMenuOne, setActiveMenuOne] = useState('all');
    const itemsPerPage = 8;
    const pageName = 'equipment';

    const menuItemsOne = [
        { img: MenuImg, id: 'all', name: 'Все обладнання' },
        { img: MenuImg1, id: '73', name: 'Ракети та рогатки' },
        { img: MenuImg2, id: '74', name: 'Ємності для підгодовування' },
        { img: MenuImg3, id: '75', name: 'Тубуси та чохли' },
        { img: MenuImg4, id: '76', name: 'Сумки' },
        { img: MenuImg5, id: '77', name: 'Коробки для риболовлі' },
        { img: MenuImg6, id: '78', name: 'Платформи та станції' },
        { img: MenuImg7, id: '79', name: 'Ящики для риболовлі' },
        { img: MenuImg8, id: '80', name: 'Поводочниці та мотовила' }
    ];

    const { products: allProducts, error, loading } = useFetchProducts();
    const products = allProducts || [];
    const categoriesOne = [73, 74, 75, 76, 77, 78, 79, 80];

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
        { title: 'Вудки', link: '/pages/fishing-rods' },
        { title: 'Котушки', link: '/pages/coils' },
        { title: 'Снасті', link: '/pages/tackle' },
        { title: 'Прикормки', link: '/pages/lure' },
        { title: 'Одяг', link: '/pages/cloth' },
        { title: 'Обладнання', link: '/pages/equipment' },
        { title: 'Ліхтарі', link: '/pages/lanterns' },
        { title: 'Термобілизна', link: '/pages/thermal-underwear' },
    ]
    return (
        <div className={styles.container}>
            <PagesTop asideMenuItems={asideMenuItems} topImage={topImage}/>
            <div className={styles.menu}>
                <h1 className={styles.menuTitle}>Обладнання</h1>
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

export default Equipment;



