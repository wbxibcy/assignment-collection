const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const { pool } = require('../utils/db');

const uploadFolder = path.join(__dirname, '../');
const downloadFolder = path.join(__dirname, '../downloads');

const downloadHomework = async (req, res) => {
    try {
        const { class_name, homework_number } = req.query;

        // 参数验证
        if (!class_name || !homework_number) {
            return res.status(400).json({ error: '班级名和作业编号不能为空' });
        }

        const [rows] = await pool.query(
            `WITH Ranked AS (
                SELECT 
                    u.username AS studentname, 
                    u.class AS classname, 
                    sc.filename, 
                    sc.homework_number AS hwnumber, 
                    sc.created_at,
                    ROW_NUMBER() OVER (PARTITION BY sc.student_id, sc.homework_number ORDER BY sc.created_at DESC) AS rn
                FROM student_courses sc
                JOIN users u ON sc.student_id = u.id
                WHERE sc.course_id = (SELECT id FROM courses WHERE course_name = ?)
                  AND sc.homework_number = ?
            )
            SELECT studentname, classname, filename, hwnumber, created_at
            FROM Ranked
            WHERE rn = 1`,
            [class_name, homework_number]
        );
        

        if (rows.length === 0) {
            return res.status(404).json({ error: '没有找到相关作业文件' });
        }

        const zipFileName = `homework_${class_name}_${homework_number}_${Date.now()}.zip`;
        const zipFilePath = path.join(downloadFolder, zipFileName);

        // 创建一个写入流
        const output = fs.createWriteStream(zipFilePath);

        // 使用 archiver 创建压缩包
        const archive = archiver('zip', { zlib: { level: 9 } });

        // 通过管道将压缩包内容写入文件
        archive.pipe(output);

        const addedFiles = new Set(); // 用于跟踪已经添加的学生文件

        // 遍历查询结果，按学生和提交时间选择最新文件
        rows.forEach((file) => {
            const studentName = file.username;
            const studentClass = file.class;
            const filePath = path.join(uploadFolder, file.filename);

            if (!addedFiles.has(file.filename) && fs.existsSync(filePath)) {
                // 提取文件扩展名
                const extname = path.extname(file.filename);
                // 文件名使用学号_姓名_班级_作业编号的格式，保留原文件扩展名
                const newFileName = `${file.student_id}_${studentName}_${studentClass}_${file.homework_number}${extname}`;

                archive.append(fs.createReadStream(filePath), { name: newFileName });

                // 将文件标记为已添加
                addedFiles.add(file.filename);
            }
        });

        // 当压缩完毕后，返回给客户端下载文件
        output.on('close', () => {
            // 设置响应头，提示浏览器下载文件
            res.download(zipFilePath, zipFileName, (err) => {
                if (err) {
                    console.error('下载文件时出错:', err);
                    res.status(500).json({ error: '下载失败' });
                }

                // 下载完成后删除临时生成的 zip 文件
                fs.unlink(zipFilePath, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error('删除临时文件时出错:', unlinkErr);
                    }
                });
            });
        });

        // 监听压缩过程中的错误
        archive.on('error', (err) => {
            console.error('压缩文件时出错:', err);
            res.status(500).json({ error: '压缩失败' });
        });

        // 完成压缩
        archive.finalize();

    } catch (error) {
        console.error('下载文件时出错:', error);
        res.status(500).json({ error: '服务器错误' });
    }
};

module.exports = { downloadHomework };
