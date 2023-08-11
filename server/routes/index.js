const express = require('express');
const { login, register, uploadVideo } = require('../controller');

const upload = require('../middleware/index')


const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/upload', upload.single('video'), uploadVideo)

module.exports = { router }

