const path = require('path')
const express = require('express')
const expressSession = require('express-session')
const expressHandlebars = require('express-handlebars')
const handlebars = require('handlebars')
const mongoose = require('mongoose')
const MongoStore = require('connect-mongodb-session')(expressSession)
const csurf = require('csurf')
const connectFlash = require('connect-flash')
const compression = require('compression')
const {
  allowInsecurePrototypeAccess,
} = require('@handlebars/allow-prototype-access')
const varMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/user')
const errorMiddleware = require('./middleware/error')
const fileMiddleware = require('./middleware/file')
const homeRoutes = require('./routes/home')
const coursesRoutes = require('./routes/courses')
const addRoutes = require('./routes/add')
const cardRoutes = require('./routes/card')
const ordersRoutes = require('./routes/orders')
const authRoutes = require('./routes/auth')
const profileRoutes = require('./routes/profile')
const keys = require('./keys/index')

const app = express()
const hbs = expressHandlebars.create({
  extname: 'hbs',
  defaultLayout: 'main',
  handlebars: allowInsecurePrototypeAccess(handlebars),
  helpers: require('./utils/hbs-helpers'),
})
const store = new MongoStore({
  collection: 'sessions',
  uri: keys.MONGODB_URI,
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use(
  session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
  })
)
app.use(fileMiddleware.single('avatar'))
app.use(csurf())
app.use(connectFlash())
app.use(compression())
app.use(varMiddleware)
app.use(userMiddleware)

app.use('/', homeRoutes)
app.use('/courses', coursesRoutes)
app.use('/add', addRoutes)
app.use('/card', cardRoutes)
app.use('/orders', ordersRoutes)
app.use('/auth', authRoutes)
app.use('/profile', profileRoutes)

app.use(errorMiddleware)

const PORT = process.env.PORT || 3000

async function start() {
  try {
    await mongoose.connect(keys.MONGODB_URI, {
      useFindAndModify: false,
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}...`)
    })
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}

start()
