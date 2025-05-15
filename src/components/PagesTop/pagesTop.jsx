import React from 'react';
import AsideMenuList from '../AsideMenu/asideMenu';
import ToMainBtn from '../btns/ToMainBtn/ToMainBtn';
import Image from 'next/image';
import styles from "./_pageTop.module.scss";

const PagesTop = ({asideMenuItems, topImage}) => {
    return (
        <div className={styles.pageTop}>
            <div className={styles.menuBlock}>
                <AsideMenuList items={asideMenuItems} />
                <ToMainBtn/>
            </div>
            <div className={styles.imgBlock}>
                <Image
                    src={topImage}
                    alt="Top banner"
                    fill
                    className={styles.topImage}/>    
            </div>
        </div>
    )
}

export default PagesTop;