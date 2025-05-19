'use client';  
import Image from "next/image";
import Link from "next/link";
import styles from "../Header/_Header.module.scss";
import AuthBtn from "../users/AuthBtn/page";
import Logo from "../../../public/logo/logo 1.svg";
import Telefon from "../../../public/logo/telefon.svg";
import Insta from "../../../public/logo/insta 1.svg";
import Viber from "../../../public/logo/Viber.svg";
import Telegramm from "../../../public/logo/telegram.svg";
import MailBtn from "../btns/MailBtn";
import CardIcon from "../../../public/logo/cartIcon.png"
import { useAuth } from "../../components/users/authContext";
import CartCounterBadge from "@/src/app/cart/CartCounterBadge/CartCounterBadge";


const Header = () => {

const { user } = useAuth(); 
  return (
    <header className={styles.header} id="header">
      <div className={styles.container}>
        <div className={styles.headerBlock}>
          <div className={styles.logoBlock}>
            <Image
                src={Logo}
                alt="Logo"
                className={styles.logoImg}
            />
          </div>

          <div className={styles.titleBlock}>
            <h1 className={styles.title}>ЄГЕР</h1>
            <h2 className={styles.subtitle}>магазин зброї</h2>
          </div>

          <div className={styles.itemsBlock}>
            <div className={styles.dataBlock}>
              <p className={styles.city}>м. Запоріжжя</p>
              <p className={styles.address}>вул. Базарна 14б</p>
              <p className={styles.tel}>
                <Image src={Telefon} alt="Телефон"  className={styles.iconTel}/>
                055 555 55 55
              </p>
            </div>

            <div className={styles.socialBlock}>
              <Link href="https://instagram.com/egerzp" target="_blank">
                <Image src={Insta} alt="Instagram"  className={styles.icon}/>
              </Link>
              <Link href="#" target="_blank">
                <Image src={Viber} alt="Viber"  className={styles.icon}/>
              </Link>
              <Link href="https://t.me/egerzp" target="_blank">
                <Image src={Telegramm} alt="Telegram"  className={styles.icon}/>
              </Link>
              <MailBtn/>
            </div>
            <div className={styles.authBlock}>
              <AuthBtn />
            <Link href={user ? "/cart" : "/login"}>
                <Image src={CardIcon} alt="Cart" className={styles.icon} />
                <CartCounterBadge />
            </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;





