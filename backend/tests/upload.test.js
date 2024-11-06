// const request = require('supertest');
// const app = require('../app'); // 引入你的 Express 应用
// const fs = require('fs');
// const path = require('path');
// const { pool } = require('../utils/db'); // 引入数据库连接池

// // 存储测试中创建的文件路径
// const testFiles = [];

// describe('File Upload API', () => {
//   let studentId;
//   let courseId;

//   beforeEach(async () => {
//     jest.clearAllMocks(); // 清除所有模拟

//     // 清空表数据
//     await pool.query('DELETE FROM student_courses');
//     await pool.query('DELETE FROM teacher_courses');
//     await pool.query('DELETE FROM users');
//     await pool.query('DELETE FROM courses');

//     try {
//       // 插入一个学生
//       const userResult = await pool.query(
//         "INSERT INTO users (username, password, class, role) VALUES ('student1', 'password', 'Physics', 'student')"
//       );
//       console.log('userResult:', userResult); // 输出查询结果

//       studentId = userResult[0].insertId || userResult[0].lastInsertId;

//       // 插入一个课程
//       const courseResult = await pool.query(
//         "INSERT INTO courses (course_name, description) VALUES ('Physics', 'Physics course description')"
//       );

//       courseId = courseResult[0].insertId || courseResult[0].lastInsertId;

//       console.log(`Student ID: ${studentId}, Course ID: ${courseId}`);
//     } catch (err) {
//       console.error('Error during setup:', err);
//       throw err;
//     }
//   });

//   // 在每个测试后清理上传的文件
//   afterEach(async () => {
//     for (const filePath of testFiles) {
//       if (fs.existsSync(filePath)) {
//         fs.unlinkSync(filePath); // 删除文件
//       }
//     }
//     testFiles.length = 0;

//     const uploadsDir = path.join(__dirname, '..', 'uploads');
//     if (fs.existsSync(uploadsDir)) {
//       const files = fs.readdirSync(uploadsDir);
//       for (const file of files) {
//         const filePath = path.join(uploadsDir, file);
//         if (file.startsWith('upload_')) {
//           fs.unlinkSync(filePath); // 删除文件
//         }
//       }
//     }
//   });

//   // 测试成功上传文件
//   it('should upload a file and save its information in the database', async () => {
//     const filePath = path.join(__dirname, './testFiles/testfile.txt');
//     fs.writeFileSync(filePath, 'This is a test file content.');

//     const res = await request(app)
//       .post('/api/uploads')
//       .field('name', 'student1')
//       .field('className', 'Physics')
//       .field('HWnumber', '1')
//       .attach('assignmentFile', filePath);

//     expect(res.status).toBe(200);
//     expect(res.body.message).toBe('文件上传并记录成功');

//     // 检查数据库中的相关记录
//     const dbResult = await pool.query('SELECT * FROM student_courses WHERE student_id = ? AND course_id = ?', [studentId, courseId]);
//     console.log("这是测试的dbresult")
//     console.log(dbResult[0][0]);
//     expect(dbResult[0][0].filename).toMatch(/^uploads\/[a-f0-9]{64}\.txt$/);
//     testFiles.push(path.join(__dirname, '..', dbResult[0][0].filename));
//   });

//   // 测试未上传文件的情况
//   it('should return 400 if no file is uploaded', async () => {
//     const res = await request(app)
//       .post('/api/uploads') // 使用正确的 API 路径
//       .field('name', 'student1')
//       .field('className', 'Physics')
//       .field('HWnumber', '1');

//     expect(res.status).toBe(400);
//     expect(res.body.message).toBe('未上传文件');
//   });
// });
