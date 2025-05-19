import { useEffect, useState } from "react";
import { useAuth } from "../../components/users/authContext"; 

export function useCartCount() {
    const { user } = useAuth();
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!user) {
        setCount(0);
        return;
        }

        const fetchCartCount = async () => {
        try {
            const res = await fetch(`/api/cart/count?user_id=${user.id}`);
            if (!res.ok) {
            setCount(0);
            return;
            }
            const data = await res.json();
            setCount(data.count || 0);
        } catch (err) {
            console.error("Ошибка при получении количества товаров в корзине:", err);
            setCount(0);
        }
        };

        fetchCartCount();

        const interval = setInterval(fetchCartCount, 20000); 
        return () => clearInterval(interval);
    }, [user]);

    return count;
}



