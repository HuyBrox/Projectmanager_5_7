const dashboardRouter = require('./dashboard.route');
const productRouter = require('./product.route');
const systemConfig = require('../../config/system');
const categoryProductRouter = require('./category-product.route');
const roleRouter = require('./role.route');
const accountRouter = require('./account.route');
const loginRouter = require('./login.route');
const authMiddleware = require('../../middleware/admin/auth.middleware');
module.exports = (app) => {
    const pathAdmin = systemConfig.prefixAdmin;
    app.use(pathAdmin + '/dashboard', authMiddleware.requireAuth, dashboardRouter);
    app.use(pathAdmin + '/product', authMiddleware.requireAuth, productRouter);
    app.use(pathAdmin + '/category-product', authMiddleware.requireAuth, categoryProductRouter);
    app.use(pathAdmin + '/roles', authMiddleware.requireAuth, roleRouter);
    app.use(pathAdmin + '/accounts', authMiddleware.requireAuth, accountRouter);
    app.use(pathAdmin + '/auth', loginRouter);
}