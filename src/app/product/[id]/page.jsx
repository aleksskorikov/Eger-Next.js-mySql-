'use client';

import { useParams } from "next/navigation";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./_product.module.scss";
import MarqueeСontent from "../../../components/mainContent/MarqueeСontent/marqueeСontent";
import BackToMenuBtn from "../../../components/btns/BackTuMenuBtn/backTuMenuBtn";
import BuyBtn from "../../../components/btns/BuyBtn/buyBtn";
import useFetchProduct from "../../Hooks/useFetchProducts";
import useAuthUser from "../../../../pages/api/users/useAuthUser";
import imgAlt from "../../../../public/images/hanter-foto/imgAlt.jpg"

const Product = () => {
    const { id } = useParams();
    const { product, error, loading } = useFetchProduct(id);
    const user = useAuthUser();

    if (loading) return <div>Завантаження...</div>;
    if (error) return <div>Сталася помилка при завантаженні товару.</div>;
    if (!product) return <div>Товар не знайдено</div>;

    const getImagePath = (imageName) => {
        if (!imageName) return '/images/no-image.jpg';
        if (imageName.includes('/uploads/')) return imageName;
        return `/uploads/${imageName}`;
    };

    const images = product.ProductImages?.map(img => getImagePath(img.image_url)) ||
        Object.keys(product)
            .filter(key => key.startsWith("img") && product[key])
            .map(key => getImagePath(product[key]));

    const settings = {
        dots: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: true,
        infinite: images.length > 1,
        arrows: images.length > 1,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            {
                breakpoint: 1270,
                settings: {
                    slidesToShow: 1,
                    arrows: images.length > 1
                }
            },
            {
                breakpoint: 800,
                settings: {
                    slidesToShow: 1,
                    arrows: images.length > 1
                }
            },
            {
                breakpoint: 541,
                settings: {
                    slidesToShow: 1,
                    arrows: false
                }
            },
        ],
    };

    return (
        <>
            <div className={styles.container}>
                <BackToMenuBtn />
                
                <div className={styles.productCard}>

                    <h2 className={styles.productsName}>{product.name}</h2>
                    <p className={styles.description}>
                        {product.description || "Немає опису для цього товару"}
                    </p>

                    <div className={styles.cartBlock}>
                        {images.length > 0 ? (
                        <Slider key={images.join()} {...settings} className={styles.productSlider}>
                            {images.map((image, index) => (
                                <div key={index} className={styles.productSliderItem}>
                                    <img
                                        src={index === 0 && !image ? imgAlt : image}
                                        alt={`${product.name} - ${index + 1}`}
                                        className={styles.productSliderImage}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/images/hanter-foto/imgAlt.jpg'; 
                                        }}
                                    />
                                </div>
                            ))}
                        </Slider>
                    ) : (
                        <div className={styles.productSliderItem}>
                            <img
                                src="/images/hanter-foto/imgAlt.jpg"
                                alt="Нет изображения"
                                className={styles.productSliderImage}
                            />
                        </div>
                    )}

                    <div className={styles.cardDesckription}>
                        <div className={styles.productsDescription}>
                            {product.ProductDescriptions?.length > 0 && (
                                <ol className={styles.productLists}>
                                    {product.ProductDescriptions.map((desc, index) => (
                                        <li key={index} className={styles.productList}>
                                            {desc.description_text}
                                        </li>
                                    ))}
                                </ol>
                            )}
                        </div>
                    </div>
                    </div>
                    

                    <p className={styles.productsPrice}>Ціна: {product.price} грн</p>
                </div>
                
                {user ? (
                    product.status === false ? (
                        <BuyBtn product={{
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            discount: product.discount_price || 0
                        }} />
                    ) : (
                        <div className={styles.unavailableMessage}>
                            Для придбання цього товару необхідна особиста присутність та наявність усіх дозвільних документів!
                        </div>
                    )
                ) : (
                    <div className={styles.unavailableMessage}>
                        Щоб купити цей товар, будь ласка, <strong>увійдіть</strong> або <strong>зареєструйтесь</strong>.
                    </div>
                )}

                <MarqueeСontent wrapperClassName={styles.customWrapper} contentClassName={styles.customContent}>
                УВАГА!!!!! Наявність товару та ціну будь ласка уточнюйте у продавця!
            </MarqueeСontent>
            </div>
                
            
        </>
    );
};

const PrevArrow = ({ className, style, onClick }) => (
    <div
        className={`${styles.slickArrow} ${styles.slickPrev} ${className}`}
        style={{ ...style }}
        onClick={onClick}
        aria-label="Попереднє зображення"
    >
        &lt;
    </div>
);

const NextArrow = ({ className, style, onClick }) => (
    <div
        className={`${styles.slickArrow} ${styles.slickNext} ${className}`}
        style={{ ...style }}
        onClick={onClick}
        aria-label="Наступне зображення"
    >
        &gt;
    </div>
);

export default Product;


