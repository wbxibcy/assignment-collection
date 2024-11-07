const express = require('express');
const router = express.Router();
const { pool } = require('../utils/db');
const crypto = require('crypto');
const fs = require('fs');
const { DateTime } = require('luxon');
const path = require('path');
const upload = require('../services/fileService');

/**
 * @swagger
 * /test/generateTestData:
 *   post:
 *     summary: 为两名学生生成测试数据
 *     tags: 
 *       - Generate test data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               assignmentFile:
 *                 type: string
 *                 format: binary
 *                 description: 要上传的作业文件
 *     responses:
 *       200:
 *         description: 成功生成测试数据
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 成功为两名学生生成测试数据.
 *       500:
 *         description: 生成测试数据时出错
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 生成测试数据失败.
 */

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 初始化用户和课程数据
async function initializeTestData() {
    const users = [
        { username: 'John Doe3', class: 'Physics', role: 'student' },
        { username: 'Jane Smith', class: 'Chemistry', role: 'student' }
    ];

    // 插入用户数据
    for (const user of users) {
        const { username, class: userClass, role } = user;

        // 检查用户是否已存在
        const [userExists] = await pool.query('SELECT id FROM users WHERE username = ?', [username]);
        if (userExists.length === 0) {
            // 插入时使用动态的 class 和 role 字段
            await pool.query('INSERT INTO users (username, password, class, role) VALUES (?, ?, ?, ?)',
                [username, 'defaultPassword', userClass, role]);
            console.log(`用户 ${username} 插入成功！`);
        }
    }

    const courses = [
        { courseName: 'Physics' },
        { courseName: 'Chemistry' }
    ];

    // 插入课程数据
    for (const course of courses) {
        const { courseName } = course;

        // 检查课程是否已存在
        const [courseExists] = await pool.query('SELECT id FROM courses WHERE course_name = ?', [courseName]);
        if (courseExists.length === 0) {
            await pool.query('INSERT INTO courses (course_name) VALUES (?)', [courseName]);
            console.log(`课程 ${courseName} 插入成功！`);
        }
    }
}

router.post('/generateTestData', upload.single('assignmentFile'), async (req, res) => {
    try {
        // 初始化数据
        await initializeTestData();

        // 定义测试文件夹路径
        const testFilesDir = path.join(__dirname, '../tests/testFiles');
        const uploadsDir = path.join(__dirname, '../');

        // 如果文件夹不存在，则创建文件夹
        if (!fs.existsSync(testFilesDir)) {
            fs.mkdirSync(testFilesDir, { recursive: true });
        }

        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        // 学生 1：多次提交相同文件
        const studentName1 = 'John Doe1';
        const className1 = 'Physics';
        const HWnumber1 = 1;

        const filePath1 = path.join(testFilesDir, 'testfile_same.txt');
        fs.writeFileSync(filePath1, 'This is the same test file content.');

        // 获取 student_id 和 course_id
        const [student1] = await pool.query('SELECT id FROM users WHERE username = ?', [studentName1]);
        const [course1] = await pool.query('SELECT id FROM courses WHERE course_name = ?', [className1]);

        const studentId1 = student1[0].id;
        const courseId1 = course1[0].id;

        for (let i = 0; i < 2; i++) {  // 假设学生 1 提交了相同的文件两次
            const filenameHash = `uploads/${crypto.createHash('sha256').update(filePath1 + i).digest('hex')}.txt`;
            const savedFilePath = path.join(uploadsDir, filenameHash);
            fs.copyFileSync(filePath1, savedFilePath);

            const formattedDate = DateTime.now().setZone('Asia/Shanghai').toFormat('yyyy-MM-dd HH:mm:ss Z');

            await pool.query(
                'INSERT INTO student_courses (student_id, course_id, filename, homework_number, created_at) VALUES (?, ?, ?, ?, ?)',
                [studentId1, courseId1, filenameHash, HWnumber1, formattedDate]
            );

            console.log("学生1的作业记录插入成功！", filenameHash);
            await sleep(5000);
        }

        // 学生 2：多次提交不同文件
        const studentName2 = 'Jane Smith';
        const className2 = 'Chemistry';
        const HWnumber2 = 1;

        const filePath2 = path.join(testFilesDir, 'testfile_diff1.txt');
        const filePath3 = path.join(testFilesDir, 'testfile_diff2.txt');
        fs.writeFileSync(filePath2, 'This is the first different test file content.');
        fs.writeFileSync(filePath3, 'This is the second different test file content.');

        const [student2] = await pool.query('SELECT id FROM users WHERE username = ?', [studentName2]);
        const [course2] = await pool.query('SELECT id FROM courses WHERE course_name = ?', [className2]);

        const studentId2 = student2[0].id;
        const courseId2 = course2[0].id;

        const filenameHash2 = `uploads/${crypto.createHash('sha256').update(filePath2).digest('hex')}.txt`;
        const filenameHash3 = `uploads/${crypto.createHash('sha256').update(filePath3).digest('hex')}.txt`;

        const savedFilePath2 = path.join(uploadsDir, filenameHash2);
        const savedFilePath3 = path.join(uploadsDir, filenameHash3);

        fs.copyFileSync(filePath2, savedFilePath2);
        fs.copyFileSync(filePath3, savedFilePath3);

        // 插入第一份文件记录
        const formattedDate2 = DateTime.now().setZone('Asia/Shanghai').toFormat('yyyy-MM-dd HH:mm:ss Z');
        await pool.query(
            'INSERT INTO student_courses (student_id, course_id, filename, homework_number, created_at) VALUES (?, ?, ?, ?, ?)',
            [studentId2, courseId2, filenameHash2, HWnumber2, formattedDate2]
        );
        console.log("学生2的第一份作业记录插入成功！", filenameHash2);

        // 等待3秒
        await sleep(3000);

        // 插入第二份文件记录
        const formattedDate3 = DateTime.now().setZone('Asia/Shanghai').toFormat('yyyy-MM-dd HH:mm:ss Z');
        await pool.query(
            'INSERT INTO student_courses (student_id, course_id, filename, homework_number, created_at) VALUES (?, ?, ?, ?, ?)',
            [studentId2, courseId2, filenameHash3, HWnumber2, formattedDate3]
        );
        console.log("学生2的第二份作业记录插入成功！", filenameHash3);


        res.status(200).json({ message: '成功为两名学生生成测试数据.' });
    } catch (error) {
        console.error('生成测试数据时出错:', error);
        res.status(500).json({ error: '生成测试数据失败.' });
    }
});

module.exports = router;
