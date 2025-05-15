import { useAuth } from '../../../../../components/users/authContext'; 
import styles from "./_btns.module.scss";

const AcceptOrderButton = ({ orderId, onAccepted }) => {
    const { user } = useAuth();  
    const userId = user?.id;  


    const handleAccept = async () => {
        if (!userId) {
        alert('Невозможно принять заказ, поскольку не найден userId.');
        return;
        }

        try {
        const response = await fetch(`/api/orders/${orderId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
            status: 'processing',
            staff_id: userId, 
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to accept the order');
        }

            if (onAccepted) { 
                onAccepted(orderId);
            }   
        } catch (error) {
        console.error('Error accepting the order:', error);
        alert('Помилка при прийнятті замовлення');
        }
    };

    return (
        <button onClick={handleAccept} className={styles.acceptButton}>Прийняти</button>
    );
};

export default AcceptOrderButton;

