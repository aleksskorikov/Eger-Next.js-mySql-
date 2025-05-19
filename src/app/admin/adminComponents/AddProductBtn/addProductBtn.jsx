"use client";

import React, { useState } from "react";
import AddProductForm from "../AddProductForm/addProductForm";
import styles from "./_addProductBtn.module.scss";

const AddProductBtn = ({ onAddProduct, selectedCategory }) => {
    const [showForm, setShowForm] = useState(false);

    return (
        <div className={styles.btn}>
            <button 
                className={styles.addProductBtn} 
                onClick={() => setShowForm(true)}
                disabled={!selectedCategory?.category}
            >
                Додати товар
            </button>

            {showForm && (
                <AddProductForm 
                    onAddProduct={onAddProduct}
                    onCancel={() => setShowForm(false)}
                    selectedCategory={selectedCategory}
                />
            )}
        </div>
    );
};

export default AddProductBtn;




