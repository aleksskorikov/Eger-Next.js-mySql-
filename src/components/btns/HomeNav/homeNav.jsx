"use client";
import styles from "./_homeNav.module.scss"; 
import React, { useEffect, useRef } from "react";

const HomeNav = () => {
    const navRef = useRef(null);

    useEffect(() => {
        if (navRef.current) {
            const links = navRef.current.querySelectorAll("button");
            links.forEach(link => {
                link.onclick = () => {
                    const targetId = link.getAttribute("data-link");
                    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
                };
            });
        }
    }, []);

    return (
        <nav className={styles.nav} ref={navRef}>
            <div className={styles.navMenu}>
                <button className={styles.navButton} data-link="section-hunting">Полювання</button>
                <button className={styles.navButton} data-link="section-fishing">Риболовля</button>
                <button className={styles.navButton} data-link="section-weapon">Зброя та самооборона</button>
                <button className={styles.navButton} data-link="section-tourism">Туризм</button>
            </div>
        </nav>
    );
};

export default HomeNav;
