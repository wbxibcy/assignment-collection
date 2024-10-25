const express = require('express');
const { uploadController } = require('../controllers/uploadController');
const upload = require('../services/fileService');

const router = express.Router();

// POST 路由，用于文件上传
router.post('/', upload.single('assignmentFile'), uploadController);

module.exports = router;
