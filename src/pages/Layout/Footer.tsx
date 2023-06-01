import React from "react";
import styles from "pages/Layout/Footer.module.scss";

const Footer: React.FC = () => {

    return (
        <footer className={styles.footer}>
            <div className={styles.contents}>
                <h2 className={styles.title}>
                    Inventory Manager By PaytakCode
                </h2>
            </div>
        </footer>
    );
};

export default Footer;