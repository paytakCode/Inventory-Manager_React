import React, {useState} from "react";
import Layout from "pages/Layout/Layout";
import ContentContainer from "pages/Container/ContentContainer";
import {renderContentByMenu} from "utils/ContentUtil";

const MainPage: React.FC = () => {
    const [containerContent, setContainerContent] = useState<string>("Default");

    const handleMenuSelect = (selectedMenu: string) => {
        setContainerContent(selectedMenu);
    };

    const renderPage = (menu: string) => {
        const ContentComponent = renderContentByMenu(containerContent);
        return ContentComponent ? <ContentComponent/> : null;
    };

    return (
        <Layout onMenuSelect={handleMenuSelect}>
            <ContentContainer renderPage={renderPage}/>
        </Layout>
    );
};

export default MainPage;
