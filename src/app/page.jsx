'use client'; 
import styles from "./_page.module.scss"; 
import MarqueeСontent from "../components/mainContent/MarqueeСontent/marqueeСontent";
import HomeNav from "../components/btns/HomeNav/homeNav";
import Hunting from "../components/mainContent/hanting";
import Fishing from "../components/mainContent/fishing";
import Weapon from "../components/mainContent/weapon";
import Tourizm from "../components/mainContent/tourizm";
import OllAll from "../components/OllAll/OllAll";

export default function Home() {
  return (
    < >
      <div className={styles.container}>
        <MarqueeСontent children={" Ласкаво просимо до нашого магазину полювання, риболовлі, туризму, зброї та комплектуючих! Ми пропонуємо найкращі товари для ваших пригод!"}/>
        <HomeNav />
        <Hunting />
        <Fishing/>
        <Weapon />
        <Tourizm />
      </div>
      <OllAll />
    </>
  );
}
