import React from "react";
import Header from "pages/Layout/Header";
import Footer from "pages/Layout/Footer";
import styles from "pages/Layout/Layout.module.scss";

const Layout = (props: { children: React.ReactNode, onMenuSelect: (menu: string) => void }) => {

    return (
        <div>
            <Header onMenuSelect={props.onMenuSelect}/>

            <main className={styles.main}>
                {props.children}
            </main>

            <Footer/>
        </div>
    );
};

export default Layout;