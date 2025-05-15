'use client';

import { useState, useEffect } from 'react';

export default function useAuthUser() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const firstName = localStorage.getItem('firstName');
        const email = localStorage.getItem('email');
        const id = localStorage.getItem('id');
        const role = localStorage.getItem('role');

        if (!token) {
            setUser(null);
            return;
        }

        try {
            const decoded = JSON.parse(atob(token.split('.')[1]));  

            if (decoded.exp * 1000 < Date.now()) {
                localStorage.clear();
                setUser(null);
            } else {
                const userData = {
                    id: id || decoded.id,  
                    firstName: firstName || decoded.first_name, 
                    email: email || decoded.email,  
                    role: role || decoded.role, 
                    token,
                };

                setUser(userData);
            }
        } catch (err) {
            console.error('Ошибка декодирования токена:', err);
            localStorage.clear();
            setUser(null);
        }
    }, []);

    return user;
}
