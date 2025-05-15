'use client';

import React from 'react';
import SliderWrapper from './SliderWrapper/SliderWrapper';
import styles from './_mainContent.module.scss';

import Rods from '../../../public/images/fishing-foto/fishing rods.jpg';
import Coils from '../../../public/images/fishing-foto/coils.webp';
import Tackle from '../../../public/images/fishing-foto/tackle.jpg';
import Bait from '../../../public/images/fishing-foto/bait.jpg';
import Equipment from '../../../public/images/fishing-foto/equipment.jpg';
import Cloth from '../../../public/images/hanter-foto/cloth.webp';
import Lanterns from '../../../public/images/fishing-foto/lanterns.svg';
import Underwear from '../../../public/images/fishing-foto/thermal underwear.svg';


const categories = [
    { image: Rods, title: 'Вудки', link: '/pages/fishing-rods', items: ['Спінінги', 'Фідери', 'Поплавочні', 'Телескопічні'] },
    { image: Coils, title: 'Котушки', link: '/pages/coils', items: ['Безінерційні', 'Мультиплікаторні', 'Інерційні'] },
    { image: Tackle, title: 'Оснастка', link: '/pages/tackle', items: ['Гачки', 'Повідки', 'Поплавки', 'Грузила'] },
    { image: Bait, title: 'Прикормки', link: '/pages/lure', items: ['Блешні', 'Балансири', 'Воблери', 'Силікон', 'Діпи', 'Прикормки' ] },
    { image: Equipment, title: 'Аксесуари', link: '/pages/equipment', items: ['Підсаки', 'Садки', 'Коробки'] },
    {
        image: Cloth,
        title: 'Одяг',
        link: '/pages/cloth',
        categories: [
            {
                subtitle: "Верхній одяг",
                items: ["Куртки", "Костюми", "Футболки та джемпера", "Штани та комбінезони"],
            },
            {
                subtitle: "Взуття",
                items: ["Черевики" , "Чоботи", "Гумові чоботи" , "Заброди та комбінезони"],
            }
        ],
    },
    { image: Lanterns, title: 'Ліхтарі', link: '/pages/lanterns', items: ['Налобні', 'Ручні', 'Кемпінгові'] },
    { image: Underwear, title: 'Термобілизна', link: '/pages/thermal-underwear', items: ['Комплекти', 'Футболки', 'Штани'] }
];
    
const Fishing = () => {
    return (
        <section className={styles.section} id="section-fishing">
            <h3 className={styles.sectionTitle}>Риболовля</h3>
            <div className={styles.sectionInfo}>
                <div className={`${styles.sectionFoto} ${styles.fishing}`}></div>
                <div className={styles.sectionText}>
                    Чоловік не може пригадати, відколи риболовля з'явилася у його житті. Вчили премудростям прадід , дідусь та батько. «Всі були азартні рибалки, вони просто таки інтуїтивно відчували рибні місця. Риболовля – спосіб життя. Це хоббі, це спосіб для релаксу. На риболовлы краще думається. От треба прийняти якесь складне рішення, скажімо. Закидаєш вудку, сидиш на березі, і рішення приходить само собою».
                </div>
            </div>
            <SliderWrapper categories={categories} />
        </section>
    );
};



export default Fishing;

