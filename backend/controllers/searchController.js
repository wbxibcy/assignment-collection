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
                SELECT c.studentname, c.studentnumber, c.filename, c.hwnumber, c.classname, c.created_at,
                    ROW_NUMBER() OVER (PARTITION BY c.studentname, c.studentnumber, c.hwnumber, c.classname 
                                        ORDER BY c.created_at DESC) AS rn
                FROM classes c
                WHERE c.classname = ? AND c.hwnumber = ?
            )
            SELECT studentname, studentnumber, filename, hwnumber, classname, created_at
            FROM Ranked
            WHERE rn = 1
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
