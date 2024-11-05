const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

// 确保上传目录存在
const fs = require('fs');
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// 配置文件上传路径和文件名
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // 上传到 'uploads/' 文件夹
    },
    filename: (req, file, cb) => {
        const { studentId, name, className, HWnumber } = req.body;
        const fileExtension = path.extname(file.originalname); // 获取文件扩展名
        const hash = crypto.createHash('sha256').update(`${HWnumber}_${studentId}_${name}_${className}_${Date.now()}`).digest('hex'); // 生成哈希值
        const hashedFilename = `${hash}${fileExtension}`; // 自定义文件名
        // console.log(hashedFilename);
        cb(null, hashedFilename); // 使用哈希文件名
    },
});

// 初始化 multer 中间件
const upload = multer({ storage: storage });

module.exports = upload;