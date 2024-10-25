const express = require('express');
const cors = require('cors');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();
const port = 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 上传文件的静态路径
app.use('/uploads', express.static('uploads'));

// 路由
app.use('/api/uploads', uploadRoutes);

// 导出 app 实例，而不是启动服务器
module.exports = app;

// // 启动服务器
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });
