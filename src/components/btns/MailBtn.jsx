'use client';

import React, { useState } from 'react';
import Image from "next/image";
import MailIcon from "../../../public/logo/mail 1.svg";
import styles from "../Header/_Header.module.scss";
import Mail from '../Mail/Mail'; 

const MailBtn = () => {
    const [isMailVisible, setIsMailVisible] = useState(false);

    const toggleMail = () => {
        setIsMailVisible(!isMailVisible);
    };

    return (
        <div>
            <button className={styles.btn} onClick={toggleMail}>
                <Image src={MailIcon} alt="Mail" className={`${styles.icon} ${styles.btn}`} />
            </button>
            {isMailVisible && <Mail onClose={toggleMail} />}
        </div>
    );
};

export default MailBtn;


