'use client';

import { useState, useEffect } from 'react';
import StaffForm from '../../AddManagersForm/page';
import styles from "./_manadgersFormBtns.module.scss";
import StaffList from '../staffList';

const StaffManagement = () => {
    const [isFormVisible, setFormVisible] = useState(false);
    const [editingStaffId, setEditingStaffId] = useState(null);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [staffList, setStaffList] = useState([]); 

    useEffect(() => {
        const fetchStaffData = async () => {
            const response = await fetch('/api/staff');
            const data = await response.json();
            setStaffList(data);
        };
        fetchStaffData();
    }, []);

    const handleSelectStaff = (staff) => {
        setSelectedStaff(staff); 
        setFormVisible(true); 
    };

    const handleAddStaffClick = () => {
        setEditingStaffId(null); 
        setSelectedStaff(null); 
        setFormVisible(true);  
    };


    const handleCloseForm = () => {
        setFormVisible(false); 
    };

    return (
        <div className={styles.formContainer}>
            <div className={styles.blockBtns}>
                <button onClick={handleAddStaffClick} className={styles.addFormBtn}>Додати нового співробітника</button>
            </div>
            <StaffList onSelectStaff={handleSelectStaff} />
            
            {isFormVisible && (
                <div className={styles.formsWrapper}>
                    <StaffForm 
                        staffData={selectedStaff} 
                        onSubmit={handleCloseForm} 
                    />
                    <button onClick={handleCloseForm} className={styles.formsWrapperBtn}>Close</button>
                </div>
            )}
        </div>
    );
};

export default StaffManagement;

