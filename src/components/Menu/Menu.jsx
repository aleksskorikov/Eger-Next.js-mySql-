import React from 'react';
import Image from 'next/image';
import styles from './_menu.module.scss';

const Menu = ({ menuItems, activeMenu, onMenuItemClick }) => {
    return (
        <div className={styles.menuOne}>
            {menuItems.map(({ img, id, name }) => (
                <div key={id} className={styles.menuItems} onClick={() => onMenuItemClick(id)}>
                    <Image 
                        src={img} 
                        alt={name} 
                        width={130}
                        height={130}
                        className={`${styles.menuImg} ${activeMenu === id ? styles.active : ''}`} 
                        priority
                    />
                    <p className={styles.menuName}>{name}</p>
                </div>
            ))}
        </div>
    );
};

export default Menu;
