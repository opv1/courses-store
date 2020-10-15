const path = require('path');
const express = require('express');
const Handlebars = require('handlebars');
const expressHandlebars = require('express-handlebars');
const mongoose = require('mongoose');
const {
  allowInsecurePrototypeAccess,
} = require('@handlebars/allow-prototype-access');
const homeRoutes = require('./routes/home');
const coursesRoutes = require('./routes/courses');
const addRputes = require('./routes/add');
const cardRoutes = require('./routes/card');
const ordersRoutes = require('./routes/orders');
const User = require('./models/user');

const app = express();

const hbs = expressHandlebars.create({
  defaultLayout: 'main',
  extname: 'hbs',
  handlebars: allowInsecurePrototypeAccess(Handlebars),
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');
app.use(async (req, res, next) => {
  try {
    const user = await User.findById('5f881537b23ac303e08cb3f2');

    req.user = user;

    next();
  } catch (error) {
    console.log(error);
  }
});
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use('/', homeRoutes);
app.use('/courses', coursesRoutes);
app.use('/add', addRputes);
app.use('/card', cardRoutes);
app.use('/orders', ordersRoutes);

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    const url =
      'mongodb+srv://opv1:Jm0mb5mdWoSQYa16@cluster0.acxqe.mongodb.net/shop';

    await mongoose.connect(url, {
      useFindAndModify: false,
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    const candidate = await User.findOne();

    if (!candidate) {
      const user = new User({
        email: 'opv1@mail.ru',
        name: 'opv1',
        cart: { items: [] },
      });

      await user.save();
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

start();
