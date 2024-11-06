const express = require('express');
const { downloadHomework } = require('../controllers/downloadController');

const router = express.Router();

// 下载作业文件并压缩为zip
router.get('/', downloadHomework);

module.exports = router;
