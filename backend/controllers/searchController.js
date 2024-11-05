const { pool } = require('../utils/db');

// 搜索文件的控制器
exports.searchFiles = async (req, res) => {
    const { classname, hwnumber } = req.query;

    // 校验查询参数
    if (!classname || !hwnumber) {
        return res.status(400).json({ message: '请提供课程名称和作业编号' });
    }

    try {
        const sql = `
            SELECT *
            FROM classes
            WHERE classname = ? AND hwnumber = ?
        `;
    
        // 使用封装的查询方法
        const rows = await pool.query(sql, [classname, hwnumber]);
    
        if (rows.length > 0) {
            console.log(rows);
            res.json({
                message: '查询成功',
                data: rows,
            });
        } else {
            res.status(404).json({ message: '未找到符合条件的文件' });
        }
    } catch (error) {
        console.error('查询失败:', error);
        res.status(500).json({ message: '服务器错误，请稍后再试' });
    }
};
