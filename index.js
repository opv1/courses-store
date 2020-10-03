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

const app = express();

const hbs = expressHandlebars.create({
  defaultLayout: 'main',
  extname: 'hbs',
  handlebars: allowInsecurePrototypeAccess(Handlebars),
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.use('/', homeRoutes);
app.use('/courses', coursesRoutes);
app.use('/add', addRputes);
app.use('/card', cardRoutes);

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

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

start();
