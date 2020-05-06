// index.js

const express = require('express');
const Handlebars = require('handlebars');
const path = require('path');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const {
  allowInsecurePrototypeAccess,
} = require('@handlebars/allow-prototype-access');
const session = require('express-session');

const homeRoutes = require('./routes/home');
const cardRoutes = require('./routes/card');
const addRouters = require('./routes/add');
const ordersRoutes = require('./routes/orders');
const coursesRotes = require('./routes/courses');
const authRoutes = require('./routes/auth');
const User = require('./models/user');
const warMiddleware = require('./middleware/variables');

const app = express();

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  handlebars: allowInsecurePrototypeAccess(Handlebars),
});

app.engine('hbs', hbs.engine); // регистрирую движок
app.set('view engine', 'hbs'); // с помощью set начинаю использовать движок
app.set('views', 'views'); // первый параметр заношу переменную, а второй название папки в которой веду разработку. Название может быть любым

app.use(async (req, res, next) => {
  try {
    const user = await User.findById('5eabd3c0cb1946251098ad0e');
    req.user = user;
    next();
  } catch (e) {
    console.log(e);
  }
});

app.use(express.static(path.join(__dirname, 'public'))); // делаю папку public публичной а не динамической для того что бы express ее не обрабатывал
app.use(express.urlencoded({ extended: true })); // данный метод использую при обработке POST запроса формы добавления курса
app.use(
  session({
    secret: 'some secret value',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(warMiddleware);

app.use('/', homeRoutes); // использую импортированный роут
app.use('/add', addRouters); // использую импортированный роут
app.use('/courses', coursesRotes); // использую импортированный роут
app.use('/card', cardRoutes); // регистрирую корзину
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    const url = `mongodb+srv://konstantine899:M0HmjAaCApHdkHCl@cluster0-nijcz.mongodb.net/shop`;
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    }); // это было подключение к БД

    const candidate = await User.findOne(); // поиск пользлвателей
    if (!candidate) {
      const user = new User({
        email: '375298918971@mail.ru',
        name: 'Konstantine',
        cart: { items: [] },
      });
      await user.save();
    }

    app.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
}
start();
