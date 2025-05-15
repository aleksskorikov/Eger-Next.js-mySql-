'use client';

import React from 'react';
import SliderWrapper from './SliderWrapper/SliderWrapper';
import styles from './_mainContent.module.scss';

import Tents from '../../../public/images/tourizm-foto/tents.jpg';
import Backpacks from '../../../public/images/tourizm-foto/backpacks.webp';
import Dishes from '../../../public/images/tourizm-foto/dishes.jpg';
import Lanterns from '../../../public/images/fishing-foto/lanterns.svg';
import Underwear from '../../../public/images/fishing-foto/thermal underwear.svg';


const categories = [
    { image: Tents, title: 'Бівак', link: '/pages/bivouac', items: ['Складні меблі', 'Намети', 'Спальні мішки', 'Килимки та каремати', 'Подушки', 'Гігієна'] },
    { image: Backpacks, title: 'Сумки та рюкзаки', link: '/pages/backpacks', items: ['Сумки', 'Підсумки', 'Рюкзаки', 'Чохли для спорядження', 'Гермопродукція'] },
    { image: Dishes, title: 'Кухня та посуд', link: '/pages/dishes', items: ['Пальники', 'Термопродукція', 'Туристичний посуд'] },
    { image: Lanterns, title: 'Ліхтарі', link: '/pages/lanterns', items: ['Комплектуючі для ліхтарів', 'Налобні ліхтарі', 'Ручні ліхтарі', 'Кемпенгові ліхтарі', 'Ліхтарі зброї', 'Елементи живлення'] },
    { image: Underwear, title: 'Термобілизна', link: '/pages/thermal-underwear', items: ['Термобілизна', 'Шкарпетки', 'Головні убори', 'Нашивки', 'Рукавички', 'Пояси'] }
];

const Tourism = () => {
    return (
        <section className={`${styles.section} ${styles.tourisma}`} id="section-tourism">
            <h3 className={styles.sectionTitle}>Туризм</h3>
            <div className={styles.sectionInfo}>
                <div className={`${styles.sectionFoto} ${styles.tourism }`}></div>
                <div className={styles.sectionText}>
                    Туризм дає можливість познайомитися з культурою інших країн та регіонів, задовольняє допитливість людини, збагачує її духовно, оздоровлює фізично, сприяє розвитку особистості. Він дозволяє поєднувати відпочинок із пізнанням нового.
                </div>
            </div>
        <SliderWrapper categories={categories} />
        </section>
    );
};


export default Tourism;


