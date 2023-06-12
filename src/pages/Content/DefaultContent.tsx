import React from "react";
import {getCurrentUserInfo} from "../../services/userService";
import {isLogined} from "../../services/authService";
import styles from "pages/Content/CommonContent.module.scss";

const DefaultContent = () => {

    return (
        <div className={styles.content}>
            <div className={styles.title}>Inventory Manager Project</div>
            <div><Message/></div>
        </div>
    );
};

const Message: React.FC = () => {
    const currentUserInfo = getCurrentUserInfo();

    if (isLogined()) {
        return (<div>
            {currentUserInfo.name}님 안녕하세요. <br/>
            상단 메뉴를 이용하여 서비스를 이용해주세요.
        </div>);
    } else {
        return (<div>
            서비스를 이용하시려면
            우측 상단 버튼을 눌러 등록 및 로그인해주세요.
        </div>);
    }
    ;
};
export default DefaultContent;
