import styles from "./_marqueeСontent.module.scss"; 

const MarqueeContent = ({ children, wrapperClassName = "", contentClassName = "" }) => {
    return (
        <div className={`${styles.marquee} ${wrapperClassName}`}>
            <div className={`${styles.marqueeContent} ${contentClassName}`}>
                {children}
            </div>
        </div>
    );
};

export default MarqueeContent;
