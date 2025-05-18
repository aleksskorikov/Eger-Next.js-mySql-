"use client";

import React from 'react';
import AddManagerFormBtn from "./AddManagersFormBtn/page";
import styles from "../AdminProducts/_adminProducts.module.scss";

const Page = () => {
  return (
    <div className={styles.main}>
      <AddManagerFormBtn />
    </div>
  )
}

export default Page;