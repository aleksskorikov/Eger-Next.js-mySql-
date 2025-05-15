
'use client';
import { useRouter } from 'next/navigation'; 
import styles from "../_cart.module.scss";


const ContinueShoppingButton = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push('/'); 
  };

  return (
    <button onClick={handleClick} className={styles.continueShoppingButton}>
      Продолжить покупки
    </button>
  );
};

export default ContinueShoppingButton;




