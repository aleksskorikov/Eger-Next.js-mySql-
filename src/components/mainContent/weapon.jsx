'use client';

import React from 'react';
import styles from './_mainContent.module.scss';
import SliderWrapper from './SliderWrapper/SliderWrapper';

import Weapon from "../../../public/images/weapon-foto/weapon.svg";
import Bullets from "../../../public/images/weapon-foto/bullets.svg";
import Accessories from "../../../public/images/weapon-foto/accessories.webp";
import Components from "../../../public/images/weapon-foto/components.webp";
import Knives from "../../../public/images/hanter-foto/knives.svg";
import Tool from "../../../public/images/weapon-foto/tool.webp";
import Equipment from "../../../public/images/weapon-foto/equipment.svg";
import Defense from "../../../public/images/weapon-foto/means of self defense.svg";

const categories = [
    { image: Weapon, title: 'Зброя', link: '/pages/gan', items: ['Травматична зброя', 'Пневматична зброя', 'Зброя під патрон Флобер', 'Сигнально-шумова зброя', 'Метальна зброя'] },
    { image: Bullets, title: 'Набої', link: '/pages/bullets', items: ['Патрони', 'Релоадинг', 'Пневматичні патрони', 'Патрони Флобера', 'Стріли'] },
    { image: Accessories, title: 'Аксесуари', link: '/pages/acces', items: ['Зберігання та транспортування', 'Чищення та догляд', 'Стрілецькі аксесуари'] },
    { image: Components, title: 'Комплектуючі', link: '/pages/components', items: ['До зброї', 'Кріплення для оптики', 'Травматична зброя', 'Пневматична зброя', 'Метальна зброя'] },
    { image: Knives, title: 'Ножі', link: '/pages/knives', items: ['Фіксовані', 'Складні ножі', 'Тренувальна зброя', 'Комплектуючі', 'Точильні пристрої'] },
    { image: Tool, title: 'Інструмент', link: '/pages/tool', items: ['Мультитули', 'Мачете', 'Сокири', 'Лопати', 'Пили', 'Спецінструмент'] },
    { image: Equipment, title: 'Екіпірування', link: '/pages/equipments', items: ['Бронежилети', 'Шоломи', 'Наколінники', 'Навушники', 'Окуляри', 'Підсумки'] },
    { image: Defense, title: 'Засоби самозахисту', link: '/pages/means', items: ['Газові балончики'] }
];
    
const WeaponSection = () => {
    return (
        <section className={styles.section} id="section-weapon">
            <h3 className={styles.sectionTitle}>Зброя та самооборона</h3>
            <div className={styles.sectionInfo}>
                <div className={`${styles.sectionFoto} ${styles.selfDefense}`}></div>
                <div className={styles.sectionText}>
                    На жаль, поліція не завжди може захистити кожного з тих, хто перебуває на території України. Законодавством України передбачено широкі повноваження щодо самостійного здійснення самооборони. Конституція України проголошує, що «людина, її життя, здоров'я, честь та гідність, недоторканність та безпека вважаються в Україні найвищою соціальною цінністю» (ст.3 Конституції).
                </div>
            </div>
        <SliderWrapper categories={categories} />
        </section>
    );
};

export default WeaponSection;
