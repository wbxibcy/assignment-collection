const { pool } = require('../utils/db');
const { DateTime } = require('luxon');

const uploadController = async (req, res) => {
    // 检查文件是否上传
    if (!req.file) {
        return res.status(400).json({ message: '未上传文件' });
    }

    try {
        const { name, className, HWnumber } = req.body;
        const filePath = `uploads/${req.file.filename}`;

        // 获取上海时间并格式化
        const formattedDate = DateTime.now().setZone('Asia/Shanghai').toFormat('yyyy-MM-dd HH:mm:ss Z');
        console.log('当前上海时间:', formattedDate);

        // 查询学生ID和课程ID
        const [students] = await pool.query('SELECT id FROM users WHERE username = ? AND role = "student"', [name]);
        const [courses] = await pool.query('SELECT id FROM courses WHERE course_name = ?', [className]);

        if (students.length === 0 || courses.length === 0) {
            return res.status(404).json({ message: '未找到指定的学生或课程' });
        }

        const studentId = students[0].id;
        const courseId = courses[0].id;

        // 插入作业记录
        const [result] = await pool.query(
            'INSERT INTO student_courses (student_id, course_id, filename, homework_number, created_at) VALUES (?, ?, ?, ?, ?)',
            [studentId, courseId, filePath, HWnumber, formattedDate]
        );

        console.log('作业记录插入成功:');

        // 返回响应
        res.status(200).json({
            message: '文件上传并记录成功',
            file: req.file.filename,
            dbResult: result[0]
        });
    } catch (error) {
        console.error('数据库操作失败:', error);
        res.status(500).json({ message: '将文件信息保存到数据库时发生错误' });
    }
};

module.exports = { uploadController };
