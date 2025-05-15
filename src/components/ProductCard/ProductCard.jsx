import Link from 'next/link';
import Image from 'next/image';
import styles from './_productCard.module.scss';
import ImgAlt from "../../../public/images/hanter-foto/imgAlt.jpg"

const ProductCard = ({ product, pageName }) => {
    const imageUrl = product.ProductImages?.[0]?.image_url || ImgAlt;
    const description = product.ProductDescriptions
        ?.sort((a, b) => a.description_order - b.description_order)
        ?.map(d => d.description_text)
        ?.join(', ');

    return (
        <Link href={`/product/${product.id}`} className={styles.card}>
            <div className={styles.cardImgWrapper}>
                <Image
                    src={imageUrl}
                    alt={product.name}
                    width={250}
                    height={250}
                    className={styles.cardImg}
                    priority
                />
            </div>
            <h3 className={styles.productName}>{product.name}</h3>
            <p className={styles.productPrice}>Ціна: {product.price} грн</p>
        </Link>
    );
};

export default ProductCard;


