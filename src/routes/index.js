import homeRouter from './home.js'
import productRouter from './product.js'
import categoryRouter from './category.js'
import orderRouter from './order.js'
import employeeRouter from './employee.js'
import customerRouter from './customer.js'
import reportRouter from './report.js'
import transactionRouter from './transaction.js'

import paymentRouter from './payment.js'
import searchRoutes from './search.js';

const router = (app) => {
    app.use('/product', productRouter)
    app.use('/category', categoryRouter)
    app.use('/order', orderRouter)
    app.use('/employee', employeeRouter)
    app.use('/customer', customerRouter)
    app.use('/report', reportRouter)
    app.use('/transaction', transactionRouter)
    app.use('/payment', paymentRouter)
    app.use('/api', searchRoutes)
    app.use('/', homeRouter)


}

export { router }