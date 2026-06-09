const express = require('express');
const router = express.Router();
const validate = require('../middleware/validation');
const { registerSchema, loginSchema } = require('../validations/authValidation');
const authController = require('../controllers/authController');

// POST /api/auth/register (always creates student role)
router.post('/register', validate(registerSchema), authController.register);

// POST /api/auth/login
router.post('/login', validate(loginSchema), authController.login);

module.exports = router;
