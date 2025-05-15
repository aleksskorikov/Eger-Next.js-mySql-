"use client";
import React, { useState } from "react";
import SingUpIn from "../SingUpIn/page";
import { useAuth } from "../authContext";
import style from "./_ausBtn.module.scss";

const AuthBtn = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();

    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem("cart"); 
        localStorage.removeItem("firstName"); 
        localStorage.removeItem("id"); 
        localStorage.removeItem("token");
        logout();
    };

    return (
        <>
            {user ? (
                <div className={style.authGreeting}>
                    <p className={style.greetingText}> <span className={style.span}>Привіт,</span>  {user.firstName}!</p>
                    <button className={style.authBtn} onClick={handleLogout}>
                        Вихід
                    </button>
                </div>
            ) : (
                <button className={style.authBtn} onClick={toggleModal}>
                    Вхід / Зареєструватися
                </button>
            )}
            {isOpen && <SingUpIn loginType="user" onClose={toggleModal} />} 
        </>
    );
};

export default AuthBtn;


