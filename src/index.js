import express from 'express'
import path from 'path'
import exphbs from 'express-handlebars'
import methodOverride from 'method-override'
import { router } from './routes/index.js'
import connectDB from './databases/index.js'
import session from 'express-session'
import { fileURLToPath } from 'url'


const PORT = process.env.PORT || 3000
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const SESSION_SECRET = process.env.PORT || 'abcxyz'

const app = express()

//Kết nối đến database
connectDB()

//Cấu hình middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false
  }
}))

app.use((req, res, next) => {
  res.locals.user = req.session.user
  next()
})

app.use(express.static(path.join(__dirname, 'public')))
app.use('/assets', express.static(path.join(__dirname, 'public', 'assets')))
app.use(methodOverride('_method'))
app.engine('hbs', exphbs.engine({
  extname: '.hbs',
  helpers: {
    increment: function(value) {
      return parseInt(value) + 1
    },
    eq: (arg1, arg2) => arg1 === arg2,
    ne: (arg1, arg2) => arg1 !== arg2,
    assetPath: function(path) {
      return `/assets/${path}`
    },
    formatCurrency: function(amount) {
      return Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
    },
    statusBadge: function(status) {
      switch (status) {
      case 'Pending':
        return 'badge-warning'
      case 'Processing':
        return 'badge-info'
      case 'Completed':
        return 'badge-success'
      case 'Cancelled':
        return 'badge-danger'
      default:
        return 'badge-secondary'
      }
    },
    formatDate: function(date) {
      return new Date(date).toLocaleDateString('vi-VN')
    },
    or: function (v1, v2) {
      return v1 || v2
    },
    isAdmin: function(permissions) {
      return permissions && permissions.includes('ADMIN_PERMISSION')
    }
  }
}))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))
//Route
router(app)
app.use((req, res, next) => {
  // Hàm bạn muốn thực hiện khi gặp route không tồn tại
  res.render('pages/error', { layout: 'errorLayout' })
})

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`)
})