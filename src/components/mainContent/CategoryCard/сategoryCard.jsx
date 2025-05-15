'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './_сategoryCard.module.scss';

const CategoryCard = ({ item }) => {
    const router = useRouter();

    return (
        <div className={styles.menu} onClick={() => router.push(item.link)}>
            <div className={styles.front}>
                <Image src={item.image} alt={item.title} width={300} height={200} />
                <p className={styles.frontTitle}>{item.title}</p>
            </div>
            <div className={styles.back}>
                <p>
                    <Link href={item.link} className={styles.backTitle}>{item.title}</Link>
                </p>
                {item.categories ? (
                    item.categories.map((subCategory, idx) => (
                        <div key={idx}>
                            <p className={styles.subtitle}>{subCategory.subtitle}</p>
                            <ul>
                                {subCategory.items.map((subItem, subIdx) => (
                                    <li key={subIdx}>
                                        <Link href={item.link} className={styles.backList}>{subItem}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))
                ) : (
                    <ul>
                        {item.items.map((subItem, idx) => (
                            <li key={idx}>
                                <Link href={item.link} className={styles.backList}>{subItem}</Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default CategoryCard;
