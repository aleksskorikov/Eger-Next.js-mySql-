import { useCartCount } from '../../Hooks/useCartCount';
import styles from './_cartCounterBadge.module.scss';

export default function CartCounterBadge() {
    const count = useCartCount();

    if (count === 0) return null;

    return <span className={styles.badge}>{count}</span>;
}
