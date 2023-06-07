const moment = require('moment');

export const formatDate = (date: Date) => {
    const formatedDate = moment(date, 'YYYY-MM-DD');

    if (formatedDate.isValid()) {
        return formatedDate.format('YYYY-MM-DD');
    } else {
        return "";
    }
}