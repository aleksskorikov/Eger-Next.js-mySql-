"use client";
import React, { useState } from "react";
import styles from "./_buyBtn.module.scss";
import { useAuth } from "../../../components/users/authContext.js"; 

const BuyBtn = ({ product }) => {
    const { user } = useAuth(); 
    const [successMessage, setSuccessMessage] = useState("");

    const handleClick = async () => {
        if (!user) {
            alert("Будь ласка, увійдіть або зареєструйтесь, щоб купити товар.");
            return;
        }

        if (!user.id) {
            alert("Невідомий користувач.");
            return;
        }

        try {
            const resCart = await fetch(`/api/cart?user_id=${user.id}`);
            const dataCart = await resCart.json();

            const existingItem = dataCart.items?.find(
                (item) => item.product_id === product.id
            );

            const method = existingItem ? "PUT" : "POST";
            const url = "/api/cart";
            const body = {
                user_id: user.id,
                product_id: product.id,
                quantity: 1,
            };

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                setSuccessMessage("Товар додано до кошика!");
                setTimeout(() => setSuccessMessage(""), 1500);
            } else {
                const errorData = await res.json();
                alert("Помилка: " + (errorData.message || "Не вдалося додати товар"));
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
            alert("Помилка при з'єднанні з сервером.");
        }
    };

    return (
        <div className={styles.btnPoz}>
            <button className={styles.buyBtn} onClick={handleClick}>
                Купити
            </button>
            {successMessage && (
                <div className={styles.successMessage}>
                    <p className={styles.successMessageText}>{successMessage}</p>
                </div>
                
            )}
        </div>
    );
};

export default BuyBtn;
