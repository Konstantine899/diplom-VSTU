// courses.js

const { Router } = require('express');
const Course = require('../models/course');
const router = Router();

router.get('/', async (req, res) => {
  const courses = await Course.find().populate('userId'); // создаю объект курсов и вытаскиваю их все

  console.log(courses);

  res.render('courses', {
    title: 'Курсы',
    isCourses: true,
    courses, // добавляю данный объект на страницу
  });
});

router.get('/:id/edit', async (req, res) => {
  // редактирование курса
  if (!req.query.allow) {
    return res.redirect('/');
  }
  const course = await Course.findById(req.params.id);
  res.render('course-edit', {
    title: `Редактировать ${course.title}`,
    course,
  });
});

router.post('/edit', async (req, res) => {
  const { id } = req.body; // выношу id в отдельную переменную.
  delete req.body.id; // удаляю id потому что mongoose по умол  ниж под id
  await Course.findOneAndUpdate(id, req.body);
  res.redirect('/courses');
});

router.post('/remove', async (req, res) => {
  try {
    await Course.deleteOne({ _id: req.body.id });
    res.redirect('/courses');
  } catch (e) {
    console.log(e);
  }
});

router.get('/:id', async (req, res) => {
  const course = await Course.findById(req.params.id);
  res.render('course', {
    layout: 'empty',
    title: `Курс ${course.title}`,
    course,
  });
});

module.exports = router;
