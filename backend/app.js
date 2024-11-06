const express = require('express');
const cors = require('cors');
const uploadRoutes = require('./routes/uploadRoutes');
const searchRoutes = require('./routes/searchRoutes');
const testDataRouter = require('./routes/testData');
const downloadRouter = require('./routes/download');

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // 处理表单数据

// 上传文件的静态路径
app.use('/uploads', express.static('uploads'));

// 使用路由
app.use('/api/uploads', uploadRoutes);  // 上传文件的路由
app.use('/api/search', searchRoutes);   // 搜索文件的路由
app.use('/api/test', testDataRouter); // 插入测试数据的路由
app.use('/api/download', downloadRouter);  // 配置下载路由

module.exports = app;
