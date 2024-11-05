const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

// 定义搜索文件的路由
router.get('/', searchController.searchFiles);

module.exports = router;
