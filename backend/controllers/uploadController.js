const { pool } = require('../utils/db');

const uploadController = async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    try {
        const { studentId, name, className, HWnumber } = req.body;
        const filePath = `uploads/${req.file.filename}`; // 存储文件路径

        const currentDate = new Date();
        const options = {
            timeZone: 'Asia/Shanghai',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        const formatter = new Intl.DateTimeFormat('zh-CN', options);
        const formattedDate = formatter.format(currentDate);

        // 将文件信息存储到数据库
        const result = await pool.query(
            'INSERT INTO classes (studentname, studentnumber, filename, hwnumber, classname, created_at) VALUES (?, ?, ?, ?, ?, ?)',
            [name, studentId, filePath, HWnumber, className, formattedDate]
        );

        res.status(200).send({
            message: 'File uploaded successfully.',
            file: req.file.filename,
            dbResult: result // 返回数据库操作的结果
        });
    } catch (error) {
        console.error('数据库操作失败:', error);
        res.status(500).send('Error saving file information to the database.');
    }
};

module.exports = { uploadController };
