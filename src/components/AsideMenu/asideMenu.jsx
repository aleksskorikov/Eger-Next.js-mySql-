'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './_asideMenu.module.scss';

const AsideMenuList = ({ items = [] }) => {
    const pathname = usePathname();

    if (!items.length) return null; 

    return (
        <aside className={styles.aside}>
            <nav className={styles.menuItem}>
                {items.map((item, index) => (
                    <div key={index}>
                        <Link 
                            href={item.link} 
                            className={`${styles.menuLink} ${pathname === item.link ? styles.active : ''}`}
                        >
                            {item.title}
                        </Link>
                    </div>
                ))}
            </nav>
        </aside>
    );
};

export default AsideMenuList;




