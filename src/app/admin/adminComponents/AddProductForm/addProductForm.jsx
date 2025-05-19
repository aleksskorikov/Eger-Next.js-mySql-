"use client";

import React, { useState, useCallback, useMemo } from "react";
import EditableField from "../EditableField/editableField";
import EditableImageField from "../EditableImageField/editableImageField";
import styles from "./_addProductForm.module.scss";

const AddProductForm = ({ onAddProduct, onCancel, selectedCategory }) => {
    const [newProduct, setNewProduct] = useState({
        name: "",
        description: "",
        price: "",
        list: Array(20).fill(""),
        images: [],
        status: true, 
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFieldChange = useCallback((field, value) => {
        setNewProduct(prevState => ({
            ...prevState,
            [field]: value
        }));
    }, []);

    const handleListChange = useCallback((index, value) => {
        setNewProduct(prevState => {
            const updatedList = [...prevState.list];
            updatedList[index] = value;
            return { ...prevState, list: updatedList };
        });
    }, []);

    const handleImageChange = useCallback((file) => {
        setNewProduct(prevState => ({
            ...prevState,
            images: [...prevState.images, file]
        }));
    }, []);

    const listMemo = useMemo(() => newProduct.list, [newProduct.list]);

    const handleSaveClick = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        const formData = new FormData();

        if (!selectedCategory?.category) {
            alert("Будь ласка, оберіть категорію!");
            setIsSubmitting(false);
            return;
        }

        if (!newProduct.name.trim()) {
            alert("Будь ласка, введіть назву товару!");
            setIsSubmitting(false);
            return;
        }

        if (!newProduct.description.trim()) {
            alert("Будь ласка, введіть опис товару!");
            setIsSubmitting(false);
            return;
        }

        if (!newProduct.price || isNaN(parseFloat(newProduct.price))) {
            alert("Будь ласка, вкажіть правильну ціну!");
            setIsSubmitting(false);
            return;
        }

        formData.append("name", newProduct.name);
        formData.append("description", newProduct.description);
        formData.append("price", parseFloat(newProduct.price));
        formData.append("status", newProduct.status); 
        newProduct.images.forEach(file => {
            if (file instanceof File) {
                formData.append("images", file);
            }
        });

        const filteredList = newProduct.list.filter(item => item && item.trim());
        if (filteredList.length > 0) {
            formData.append("list", JSON.stringify(filteredList));
        }

        try {
            await onAddProduct(formData);  
            alert("Товар успішно доданий!");
            setNewProduct({
                name: "",
                description: "",
                price: "",
                list: Array(20).fill(""),
                images: [],
                status: true, 
            });
        } catch (error) {
            console.error("Помилка при додаванні товару:", error);
            alert(`Неможливо додати товар: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.form}>
            {selectedCategory && (
                <p className={styles.formSubtitle}>
                    Вибрана категорія: <strong>{selectedCategory.name}</strong>
                </p>
            )}

            <p className={styles.formSubtitle}>Основне фото</p>
            <EditableImageField
                currentImage={newProduct.images[0]}
                onSave={handleImageChange}
            />

            {Array.from({ length: 9 }).map((_, index) => (
                <div key={index}>
                    <p className={styles.formSubtitle}>Додаткове фото {index + 1}</p>
                    <EditableImageField
                        currentImage={newProduct.images[index + 1]}
                        onSave={handleImageChange}
                    />
                </div>
            ))}

            <p className={styles.formSubtitle}>Назва товару</p>
            <EditableField value={newProduct.name} onSave={(value) => handleFieldChange("name", value)} />

            <div className={styles.formSubtitle}>
                <label>
                    Активный товар
                    <input
                        type="checkbox"
                        checked={newProduct.status}
                        onChange={(e) => handleFieldChange("status", e.target.checked)} 
                    />
                </label>
            </div>

            <p className={styles.formSubtitle}>Опис товару</p>
            <EditableField value={newProduct.description} onSave={(value) => handleFieldChange("description", value)} />

            {Array.from({ length: 20 }).map((_, index) => (
                <div key={index}>
                    <p className={styles.formSubtitle}>Характеристика {index + 1}</p>
                    <EditableField value={listMemo[index]} onSave={(value) => handleListChange(index, value)} />
                </div>
            ))}

            <p className={styles.formSubtitle}>Ціна товару</p>
            <EditableField value={newProduct.price} onSave={(value) => handleFieldChange("price", value)} />

            <div className={styles.btnsBlock}>
                <button 
                    type="button" 
                    onClick={handleSaveClick} 
                    className={styles.btnOk}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Сохранение..." : "Сохранить"}
                </button>
                <button 
                    type="button" 
                    onClick={onCancel} 
                    className={styles.cancellation}
                    disabled={isSubmitting}
                >
                    Скасування
                </button>
            </div>
        </div>
    );
};

export default AddProductForm;




