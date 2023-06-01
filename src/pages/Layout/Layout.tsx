import React from "react";
import Header from "pages/Layout/Header";
import Footer from "pages/Layout/Footer";
import styles from "pages/Layout/Layout.module.scss";
import {UserInfo} from "../../components/userInfo";

const Layout = (props: { children: React.ReactNode, userInfo: UserInfo, onMenuSelect: (menu: string) => void }) => {

    return (
        <div className={styles.layout}>
            <Header userInfo={props.userInfo} onMenuSelect={props.onMenuSelect}/>

            <main className={styles.main}>
                {props.children}
            </main>

            <Footer/>
        </div>
    );
};

export default Layout;