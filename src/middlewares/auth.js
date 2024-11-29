import { permissions } from '../configs/permissions.config.js'

export const requireLogin = (req, res, next) => {
  if (!req.session?.user) {
    return res.redirect('/loginPage')
  }
  next()
}

export const ensurePasswordUpdated = (req, res, next) => {
    if (req.path === '/loginPage' || req.path === '/employee/new-password') {
        return next() 
    }
    if (req.session.user && req.session.user.isFirstLogin) {
        return res.redirect('/employee/new-password')
    }
    next()
}

export const checkUserPermission = (req, res, next) => {
    const user = req.session?.user

    if (!user) {
        return res.redirect('/loginPage')
    }

    const userPermissions = user.permissions
    const currentRoute = req.originalUrl

    const rolePermissions = {
        [permissions.ADMIN]: ['*'],
        [permissions.SALESPERSON]: ['/', '/order/addOrder', '/customer', '/product/listProduct', '/category/listCategory', '/report/listReport']
    }

    const hasPermission = userPermissions.some(permission => {
        const allowedRoutes = rolePermissions[permission]
        return allowedRoutes.includes('*') || allowedRoutes.includes(currentRoute)
    })

    if (!hasPermission) {
        return res.status(403).render('pages/errorAuth', {
            message: 'Bạn không có quyền truy cập vào trang này.',
            statusCode: 403
        })
    }

    next()
}