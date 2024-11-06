const { pool } = require('../utils/db');
const { DateTime } = require('luxon');

// 搜索文件的控制器
exports.searchFiles = async (req, res) => {
    const { classname, hwnumber } = req.query;

    // 校验查询参数
    if (!classname || !hwnumber) {
        return res.status(400).json({ message: '请提供课程名称和作业编号' });
    }

    try {
        const sql = `
            WITH Ranked AS (
                SELECT u.username AS studentname,           -- 从 users 表获取学生姓名
                    u.id AS studentnumber,               -- 从 users 表获取学生ID（对应学号）
                    sc.filename,                         -- 从 student_courses 获取作业文件名
                    sc.homework_number AS hwnumber,      -- 从 student_courses 获取作业编号
                    c.course_name AS classname,          -- 从 courses 获取课程名称
                    sc.created_at,
                    ROW_NUMBER() OVER (PARTITION BY u.id, c.id, sc.homework_number ORDER BY sc.created_at DESC) AS rn
                FROM student_courses sc
                JOIN users u ON sc.student_id = u.id       -- 连接用户表获取学生信息
                JOIN courses c ON sc.course_id = c.id      -- 连接课程表获取课程信息
                WHERE c.course_name = ? AND sc.homework_number = ?  -- 使用课程名称和作业编号筛选
            )
            SELECT studentname, studentnumber, filename, hwnumber, classname, created_at
            FROM Ranked
            WHERE rn = 1;
        `;
        
        // 使用封装的查询方法
        const rows = await pool.query(sql, [classname, hwnumber]);

        if (rows.length > 0) {
            try {
                rows[0].forEach(item => {
                    let utcTime = item.created_at;
                    utcTime = utcTime.toISOString();
    
                    if (typeof utcTime === 'string') {
                        const localCreatedAt = DateTime.fromISO(utcTime).setZone('Asia/Shanghai').toFormat('yyyy-MM-dd HH:mm:ss');
                        item.created_at = localCreatedAt;
                    }
                });
    
                console.log(rows[0]);
                res.json({
                    message: '查询成功',
                    data: rows[0],
                });
            } catch (error) {
                res.json({
                    message: '果然在用sqlite',
                    data: rows,
                });
            }
        } else {
            res.status(404).json({ message: '未找到符合条件的文件' });
        }
    } catch (error) {
        console.error('查询失败:', error);
        res.status(500).json({ message: '服务器错误，请稍后再试' });
    }
};
