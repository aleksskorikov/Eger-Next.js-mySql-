import Image from "next/image";
import Link from "next/link";
import styles from "./_Footer.module.scss"; 
import Telefon from "../../../public/logo/telefon.svg";
import Insta from "../../../public/logo/insta 1.svg";
import Viber from "../../../public/logo/Viber.svg";
import Telegramm from "../../../public/logo/telegram.svg";
import MailBtn from "../btns/MailBtn";

const Footer = () => {
return (
<footer className={styles.footer}>
    <div className={styles.container}>
    <div className={styles.footerBlock}>
        <div className={styles.footerBlockSety}>
        <h2 className={styles.blockSetyTitle}>Ми в соцсетях</h2>
        <div className={styles.blockSety}>
            <Link href="https://instagram.com/egerzp?igshid=NTc4MTIwNjQ2YQ==" passHref>
            <Image src={Insta} alt="Instagram icon" className={styles.blockSetyIcon} />
            </Link>
            <Link href="#" passHref>
            <Image src={Viber} alt="Viber icon" className={styles.blockSetyIcon} />
            </Link>
            <Link href="https://t.me/egerzp" passHref>
            <Image src={Telegramm} alt="Telegram icon" className={styles.blockSetyIcon} />
            </Link>
            <MailBtn/>
        </div>
        </div>

        <div className={styles.footerBody}>
        <h1 className={styles.footerBodyTitle}>ЄГЕР</h1>
        <h2 className={styles.footerBodySubtitle}>магазин зброї</h2>
        <div className={styles.footerBodyAdress}>
            <p className={styles.bodyAdress}>м. Запоріжжя, вул. Базарна 14б</p>
            <div className={styles.footerBodyTel}>
                <Image src={Telefon} alt="phone icon" className={styles.telLogo} />
                <p>055 555 55 55</p>
            </div>
        </div>
        </div>

        <div className={styles.footerMap} id="map">
        <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2679.5352186734044!2d35.182213725481496!3d47.809844773921746!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40dc5e723d482363%3A0x72d684f85f01200b!2z0JXQs9C10YDRjA!5e0!3m2!1sru!2sua!4v1684319526912!5m2!1sru!2sua"
            width="300"
            height="200"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className={styles.footerMapBody}
            title="Google Maps"
        ></iframe>
        </div>
    </div>
    </div>
</footer>
);
};

export default Footer;
