const multer = require('multer');
const path = require('path');

// 配置文件上传路径和文件名
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // 上传到 'uploads/' 文件夹
  },
  filename: (req, file, cb) => {
    const { studentId, name, className } = req.body;
    const fileExtension = path.extname(file.originalname); // 获取文件扩展名
    cb(null, `${studentId}_${name}_${className}${fileExtension}`); // 自定义文件名
  },
});

// 初始化 multer 中间件
const upload = multer({ storage: storage });

module.exports = upload;
