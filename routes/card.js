// routes card.js

const { Router } = require('express');
const Card = require('../models/card');
const Course = require('../models/course');
const router = Router();

router.post('/add', async (req, res) => {
  const course = await Course.getById(req.body.id);
  await Card.add(course);
  res.redirect('/card');
});

router.get('/', async (req, res) => {
  const card = await Card.fetch(); // здесь получаем всю корзину
  res.render('card', {
    title: 'Корзина',
    isCard: true, // Для того что бы навигация отображалась корректно
    courses: card.courses, // курсы выносим в отдельную переменную
    price: card.price, // цену выношу в отдельную переменную
  });
});

router.delete('/remove/:id', async (req, res) => {
  const card = await Card.remove(req.params.id);
  res.status(200).json(card);
});

module.exports = router;
