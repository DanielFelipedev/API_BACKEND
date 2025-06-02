const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/cadastro', userController.cadastro);
router.post('/login', userController.login);
router.get('/usuario/:id', userController.getUser);
router.post('/usuario/:id/velocidade', userController.updateSpeed);

module.exports = router;
