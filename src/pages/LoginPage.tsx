import React, {useState} from 'react';
import {renderContentByMenu} from "utils/ContentUtil";
import Layout from "pages/Layout/Layout";
import ContentContainer from "pages/Container/ContentContainer";

const LoginPage: React.FC = () => {
    const [containerContent, setContainerContent] = useState<string>("Login");

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
export default LoginPage;
