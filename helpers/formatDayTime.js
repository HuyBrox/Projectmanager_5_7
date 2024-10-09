// helpers/dateHelper.js
const { format } = require('date-fns');
const { vi } = require('date-fns/locale');

const formatDate = (date) => {
    return format(date, "EEEE, dd/MM/yyyy", { locale: vi });
};
const formatDateTime = (date) => {
    return format(date, "EEEE, dd/MM/yyyy HH:mm:ss", { locale: vi });
};

module.exports = { formatDate, formatDateTime };
