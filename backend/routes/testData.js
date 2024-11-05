const express = require('express');
const router = express.Router();
const { pool } = require('../utils/db');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const upload = require('../services/fileService');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

router.post('/generateTestData', upload.single('assignmentFile'), async (req, res) => {
    try {
        // 定义测试文件夹路径
        const testFilesDir = path.join(__dirname, '../tests/testFiles');

        // 如果文件夹不存在，则创建文件夹
        if (!fs.existsSync(testFilesDir)) {
            fs.mkdirSync(testFilesDir, { recursive: true });
        }

        // 学生 1：多次提交相同文件
        const studentId1 = 123456;
        const studentName1 = 'John Doe6';
        const className1 = 'Physics';
        const HWnumber1 = 1;

        const filePath1 = path.join(testFilesDir, 'testfile_same.txt');
        fs.writeFileSync(filePath1, 'This is the same test file content.');

        for (let i = 0; i < 2; i++) {  // 假设学生 1 提交了相同的文件两次
            console.log(i);
            const filenameHash = `uploads/${crypto.createHash('sha256').update(filePath1 + i).digest('hex')}.txt`;
            console.log(filenameHash);

            const currentDate = new Date();
            const options = {
                timeZone: 'Asia/Shanghai',  // 替换为所需的时区
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            };
            const formatter = new Intl.DateTimeFormat('zh-CN', options);
            const formattedDate = formatter.format(currentDate);

            await pool.query(
                'INSERT INTO classes (studentnumber, studentname, classname, HWnumber, filename, created_at) VALUES (?, ?, ?, ?, ?, ?)',
                [studentId1, studentName1, className1, HWnumber1, filenameHash, formattedDate]
            );
            console.log("插入成功！");
            await sleep(5000);
        }

        // 学生 2：多次提交不同文件
        const studentId2 = 789012;
        const studentName2 = 'Jane Smith';
        const className2 = 'Chemistry';
        const HWnumber2 = 1;

        const filePath2 = path.join(testFilesDir, 'testfile_diff1.txt');
        const filePath3 = path.join(testFilesDir, 'testfile_diff2.txt');
        fs.writeFileSync(filePath2, 'This is the first different test file content.');
        fs.writeFileSync(filePath3, 'This is the second different test file content.');

        const filenameHash2 = `uploads/${crypto.createHash('sha256').update(filePath2).digest('hex')}.txt`;
        const filenameHash3 = `uploads/${crypto.createHash('sha256').update(filePath3).digest('hex')}.txt`;

        console.log(filenameHash2);
        console.log(filenameHash3);

        await pool.query(
            'INSERT INTO classes (studentnumber, studentname, classname, HWnumber, filename) VALUES (?, ?, ?, ?, ?)',
            [studentId2, studentName2, className2, HWnumber2, filenameHash2]
        );
        await pool.query(
            'INSERT INTO classes (studentnumber, studentname, classname, HWnumber, filename) VALUES (?, ?, ?, ?, ?)',
            [studentId2, studentName2, className2, HWnumber2, filenameHash3]
        );

        res.status(200).json({ message: 'Test data generated successfully for two students.' });
    } catch (error) {
        console.error('Error generating test data:', error);
        res.status(500).json({ error: 'Failed to generate test data.' });
    }
});

module.exports = router;
