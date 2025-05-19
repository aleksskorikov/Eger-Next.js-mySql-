import React, { useState, useRef, useEffect } from 'react';
import styles from './_singUpIn.module.scss';
import { useAuth } from '../authContext';

const SingUpIn = ({ onClose }) => {
    const [isSignUp, setIsSignUp] = useState(false);
    const formContainerRef = useRef(null);
    const { login } = useAuth();

    const handleClickOutside = (event) => {
        if (formContainerRef.current && !formContainerRef.current.contains(event.target)) {
            onClose();
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSignUp = async (e) => {
        e.preventDefault();
        const form = e.target;
        const firstName = form.fullName.value.trim(); 
        const email = form.email.value;
        const password = form.password.value;
    
        try {
            const res = await fetch('/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    first_name: firstName, 
                    email,
                    password,
                }),
            });
    
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Помилка при реєстрації');
    
            alert('Користувача зареєстровано! Тепер увійдіть у систему.');
            form.reset();
    
            setIsSignUp(false);
    
        } catch (err) {
            console.error("Registration Error:", err.message);
            alert(err.message);
        }
    };
    

const handleSignIn = async (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
        const res = await fetch('/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.message || 'Помилка при вході');
        }

        const firstName = data.first_name || '';  
        const { token, role, id } = data; 

        localStorage.setItem('token', token);
        localStorage.setItem('firstName', firstName);  
        localStorage.setItem('id', id); 
        login({ id, firstName, email, role, token });

        alert('Вхід успішний!');
        form.reset();
        onClose();  
    } catch (err) {
        alert(err.message);
    }
};


    return (
        <div className={styles.blockk}>
            <div
                className={`${styles.containers} ${isSignUp ? styles.rightPanelActive : ''}`}
                ref={formContainerRef}
            >
                <div className={`${styles.containerForm} ${styles.containerSignup}`}>
                    <form className={styles.form} id="form1" onSubmit={handleSignUp}>
                        <h2 className={styles.formTitle}>Sign Up</h2>
                        <input type="text" name="fullName" placeholder="User" className={styles.input} required />
                        <input type="email" name="email" placeholder="Email" className={styles.input} required />
                        <input type="password" name="password" placeholder="Password" className={styles.input} required />
                        <button type="submit" className={styles.btn}>Зареєструватися</button>
                    </form>
                </div>

                <div className={`${styles.containerForm} ${styles.containerSignin}`}>
                    <form className={styles.form} id="form2" onSubmit={handleSignIn}>
                        <h2 className={styles.formTitle}>Увійти</h2>
                        <input type="email" name="email" placeholder="Email" className={styles.input} required />
                        <input type="password" name="password" placeholder="Password" className={styles.input} required />
                        <button type="submit" className={styles.btn}>Увійти</button>
                    </form>
                </div>

                <div className={styles.containerOverlay}>
                    <div className={styles.overlay}>
                        <div className={`${styles.overlayPanel} ${styles.overlayLeft}`}>
                            <button className={styles.btn} onClick={() => setIsSignUp(false)}>Увійти</button>
                        </div>
                        <div className={`${styles.overlayPanel} ${styles.overlayRight}`}>
                            <button className={styles.btn} onClick={() => setIsSignUp(true)}>Зареєструватися</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SingUpIn;




