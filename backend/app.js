const express = require('express');
const cors = require('cors');
const { swaggerSpec, swaggerUi } = require('./swagger'); // 引入 swagger 配置
const uploadRoutes = require('./routes/uploadRoutes');
const searchRoutes = require('./routes/searchRoutes');
const testDataRouter = require('./routes/testData');
const downloadRouter = require('./routes/download');
const authRouter = require('./routes/authRouter');
const studentRouter = require('./routes/studentRouter');

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // 处理表单数据

// 上传文件的静态路径
app.use('/uploads', express.static('uploads'));

// 使用路由
app.use('/uploads', uploadRoutes);  // 上传文件的路由
app.use('/search', searchRoutes);   // 搜索文件的路由
app.use('/test', testDataRouter); // 插入测试数据的路由
app.use('/download', downloadRouter);  // 配置下载路由
app.use('/auth', authRouter);
app.use('/students', studentRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = app;
