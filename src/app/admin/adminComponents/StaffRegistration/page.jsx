'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from '../../../../../src/components/users/SingUpIn/_singUpIn.module.scss';
import { useAuth } from '../../../../../src/components/users/authContext';

const StaffLogin = ({ onClose }) => {
    const formContainerRef = useRef(null);
    const { login } = useAuth();
    const [errorMessage, setErrorMessage] = useState('');

    const handleClickOutside = (event) => {
        if (formContainerRef.current && !formContainerRef.current.contains(event.target)) {
            onClose();
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSignIn = async (e) => {
        e.preventDefault();
        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;
        setErrorMessage('');

        try {
            const res = await fetch('/api/staff/staffLogin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.message || 'Помилка при вході');
            }

            if (!data.token) {
                alert('Такого користувача не існує');
                return;
            }

            localStorage.setItem('token', data.token);

            const userData = {
                firstName: data.fullName?.split(' ')[0] || 'Сотрудник',
                email: data.email || email,
                role: data.role || 'staff',
                id: data.id || null
            };

            login(userData);

            alert('Вхід успішний!');
            form.reset();
            onClose();
        } catch (err) {
            // console.error("Login Error:", err);
            setErrorMessage(err.message);
            localStorage.removeItem('token');
        }
    };

    return (
        <div className={styles.blockk}>
            <div className={styles.containers} ref={formContainerRef}>
                <div className={styles.containerForm}>
                    <form className={styles.form} onSubmit={handleSignIn}>
                        <h2 className={styles.formTitle}>Увійти</h2>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            className={styles.input}
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            className={styles.input}
                            required
                        />
                        {errorMessage && <div className={styles.error}>{errorMessage}</div>}
                        <button type="submit" className={styles.btn}>
                            Увійти
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default StaffLogin;
