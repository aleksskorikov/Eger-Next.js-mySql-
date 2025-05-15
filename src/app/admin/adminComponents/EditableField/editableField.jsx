import React, { useState, useEffect, useCallback } from "react";
import styles from "./_editableField.module.scss";

const EditableField = ({ value, onSave, onCancel }) => {
    const [newValue, setNewValue] = useState(value);

    useEffect(() => {
        setNewValue(value);
    }, [value]);

    const handleBlur = useCallback(() => {
        if (newValue !== value) {
            onSave(newValue);
        }
    }, [newValue, value, onSave]);

    return (
        <div className={styles.field}>
            <textarea
                type="text"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                onBlur={handleBlur} 
                className={styles.editableInput}
            />
        </div>
    );
};

export default EditableField;
