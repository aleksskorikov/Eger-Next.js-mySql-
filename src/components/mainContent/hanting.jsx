'use client';

import React from 'react';
import styles from './_mainContent.module.scss';
import SliderWrapper from './SliderWrapper/SliderWrapper';

import Guns from "../../../public/images/hanter-foto/guns.webp";
import Cartridges from '../../../public/images/hanter-foto/cartridges.webp';
import Accessories from '../../../public/images/hanter-foto/accessories.webp';
import Knives from '../../../public/images/hanter-foto/knives.svg';
import Cloth from '../../../public/images/hanter-foto/cloth.webp';
import Care from '../../../public/images/hanter-foto/care.webp';
import Stuffed from '../../../public/images/hanter-foto/stuffed animals.webp';
import Target from '../../../public/images/hanter-foto/target.webp';

const categories = [
    {
        image: Guns,
        title: 'Ружья',
        link: '/pages/guns',
        categories: [
            {
                subtitle: "Нарезные",
                items: ['Напівавтомотичні', 'Штуцери', 'З поздовжньо-ковзним затвором', 'Дрібноколіберні'],
            },
            {
                subtitle: "Гладкоствольные",
                items: ["Переломні", "Напівавтоматичні", "Помпові", "З продольно-ковзним затвором"],
            }
        ],
    },
    { image: Cartridges, title: 'Патрони', link: '/pages/cartridges', items: ['Дробові патрони', 'Картеч', 'Кульові патрони', 'Нарізні', 'Гладкоствольні'] },
    { image: Accessories, title: 'Аксесуари', link: '/pages/accessories', items: ['Кейси', 'Чохли', 'Підсумки', 'Кобури'] },
    { image: Knives, title: 'Ножі', link: '/pages/knives', items: ['Фіксовані', 'Складні', 'Тренувальна зброя'] },
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
    { image: Care, title: 'Догляд за зброєю', link: '/pages/care', items: ['Шомполи', 'Набори', 'Протяжки', 'Насадки'] },
    { image: Stuffed, title: 'Мисливські аксесуари', link: '/pages/hunting-accessories', items: ['Вабці', 'Опудала', 'Горни'] },
    { image: Target, title: 'Стрілецькі аксесуари', link: '/pages/shooting-accessories', items: ['Мішені', 'Тарілки', 'Інше'] }
];

const Hunting = () => {
    return (
        <section className={styles.section} id="section-hunting">
            <h3 className={styles.sectionTitle}>Полювання</h3>
            <div className={styles.sectionInfo}>
                <div className={styles.sectionFoto}></div>
                <div className={styles.sectionText}>
                    Давайте запитаємо себе: - навіщо ми полюємо? І відповімо чесно, 
                    не кривлячи душею, бо обдурити себе неможливо. 
                    Кожен відповість по-різному. Але всіх справжніх мисливців 
                    об'єднує одне – мисливська пристрасть.
                </div>
            </div>
            <SliderWrapper categories={categories} />
        </section>
    );
};

export default Hunting;
