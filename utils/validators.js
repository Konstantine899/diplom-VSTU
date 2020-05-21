// utils validators.js

const { body } = require('express-validator');

exports.registerValidators = [
  body('email').isEmail().withMessage('Введите корректный email'),
  body('password', 'Пароль должен быть не менее 6 символов')
    .isLength({ min: 6, max: 70 })
    .isAlphanumeric(),

  body('confirm').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Данные пароли должны совпадать');
    }
    return true;
  }),
  body('name')
    .isLength({ min: 3 })
    .withMessage('Имя должно быти минимум 3 символа'),
];
