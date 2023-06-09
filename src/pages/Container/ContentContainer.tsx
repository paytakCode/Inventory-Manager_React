import React from "react";
import styles from 'pages/Container/ContentContainer.module.scss';

interface ContentContainerProps {
    renderPage: (menu: string) => React.ReactNode;
}

const ContentContainer: React.FC<ContentContainerProps> = (props) => {
    return <div className={styles.container}>{props.renderPage("Default")}</div>;
};

export default ContentContainer;