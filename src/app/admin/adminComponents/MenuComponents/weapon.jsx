"use client";

import React, { useState } from "react";
import styles from "./_menuComponents.module.scss";
import categories from "./weaponCategories";

const Weapon = ({ onCategoryClick }) => {
    const [openCategory, setOpenCategory] = useState(null);
    const [isTitleOpen, setIsTitleOpen] = useState(true);
    const toggleCategory = (category) => {
        setOpenCategory(prev => (prev === category ? null : category));
    };

    const toggleTitle = () => {
        setIsTitleOpen(prev => !prev);
    };

    const handleItemClick = (id, name) => {
        onCategoryClick?.(id, name);
    };

    return (
        <div className={styles.hanter}>
            <p className={styles.title} onClick={toggleTitle}>
                {isTitleOpen ? "Зброя та самооборона" : "Открыть зброю та самооборону"}
            </p>

            {isTitleOpen && (
                <ol className={styles.lists}>
                    {categories.map((categoryItem, index) => (
                        <li key={index} className={styles.list}>
                            <div
                                className={styles.listTitle}
                                onClick={() => toggleCategory(categoryItem.title)}
                            >
                                {categoryItem.title}
                            </div>
                            {openCategory === categoryItem.title && (
                                <ul className={styles.subcategoryList}>
                                    {categoryItem.subcategories.map((subcategory, subIndex) => (
                                        <React.Fragment key={subIndex}>
                                            {subcategory.subtitle && (
                                                <p className={styles.listSubtitle}>
                                                    {subcategory.subtitle}
                                                </p>
                                            )}
                                            {subcategory.items.map((item, itemIndex) => (
                                                <li
                                                    key={itemIndex}
                                                    className={styles.subcategoryItem}
                                                    onClick={() => handleItemClick(item.id, item.name)}
                                                >
                                                    {item.name}
                                                </li>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ol>
            )}
        </div>
    );
};

 


export default Weapon;