export const datetimeUtil = {
    getNow: () => {


    },
    getStartDate: (date) => {
        return new Date(date).setHours(0, 0, 0, 0);
    },
    getEndDate: (date) => {
        return new Date(date).setHours(23, 59, 59, 999);
    },
    getStartMonth: (date) => {
        const tmp = new Date(date);
        return new Date(tmp.getFullYear(), tmp.getMonth(), 2);
    },
};