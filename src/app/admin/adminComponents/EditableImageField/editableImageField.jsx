'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import styles from "./_editableImageField.module.scss";

const EditableImageField = ({ currentImage, onSave, onCancel }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
            setSelectedFile(file);

            console.log('Выбранный файл:', file);
            console.log('Предпросмотр URL:', imageUrl);

            onSave(file);
        }
    };

    const handleCancel = () => {
        setSelectedImage(null);
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        
        console.log('Выбор файла отменён');
        if (onCancel) onCancel();
    };

    return (
        <div className={styles.imageField}>
            <input
                type="file"
                onChange={handleFileChange}
                className={styles.editableInput}
                ref={fileInputRef}
                accept="image/*"
            />
            {selectedImage && (
                <Image src={selectedImage} alt="Selected" width={200} height={200} />
            )}
            {selectedFile && (
                <button onClick={handleCancel} className={styles.btnCancellation}>
                    Скасувати
                </button>
            )}
        </div>
    );
};

export default EditableImageField;
