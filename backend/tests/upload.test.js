const request = require('supertest');
const app = require('../app'); // 引入你的 Express 应用
const fs = require('fs');
const path = require('path');
const { pool } = require('../utils/db'); // 引入数据库连接池

// 存储测试中创建的文件路径
const testFiles = [];

describe('File Upload API', () => {
  // 在每个测试前清理数据库
  beforeEach(async () => {
    jest.clearAllMocks(); // 清除所有模拟
    await pool.query('DELETE FROM classes'); // 清空 classes 表
  });

  // 在每个测试后清理上传的文件
  afterEach(async () => {
    // 删除测试中上传的文件
    for (const filePath of testFiles) {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // 删除文件
      }
    }
    testFiles.length = 0; // 清空测试文件列表

    // 这里可以加入逻辑来删除 uploads 文件夹中的文件
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      for (const file of files) {
        const filePath = path.join(uploadsDir, file);
        // 只删除在数据库中保存的文件
        if (file.startsWith('upload_')) { // 假设上传的文件以 'upload_' 开头
          fs.unlinkSync(filePath); // 删除文件
        }
      }
    }
  });

  // 测试成功上传文件
  it('should upload a file and save its information in the database', async () => {
    const filePath = path.join(__dirname, './testFiles/testfile.txt'); // 创建一个测试文件
    fs.writeFileSync(filePath, 'This is a test file content.'); // 创建临时文件

    const res = await request(app)
      .post('/api/uploads')
      .field('studentId', '12345')
      .field('name', 'John Doe')
      .field('className', 'Physics')
      .field('HWnumber', '1')
      .attach('assignmentFile', filePath); // 上传文件

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('File uploaded successfully.');

    // 检查数据库中是否有相关记录
    const dbResult = await pool.query('SELECT * FROM classes WHERE studentnumber = ?', [12345]);
    expect(dbResult[0].studentname).toBe('John Doe');

    // 记录哈希文件名并推送到测试文件列表
    const hashFilename = dbResult[0].filename;
    const uploadedFilePath = path.join(__dirname, '..', hashFilename); // 计算完整路径
    testFiles.push(uploadedFilePath); // 记录哈希文件路径

    expect(hashFilename).toMatch(/^uploads\/[a-f0-9]{64}\.txt$/);
  });

  // 测试未上传文件的情况
  it('should return 400 if no file is uploaded', async () => {
    const res = await request(app)
      .post('/api/uploads')
      .field('studentId', '12345')
      .field('name', 'John Doe')
      .field('className', 'Physics')
      .field('HWnumber', '1');

    expect(res.status).toBe(400);
    expect(res.text).toBe('No file uploaded.'); // 检查错误信息
  });

  // 测试文件名冲突
  it('should handle filename conflicts correctly', async () => {
    const filePath1 = path.join(__dirname, './testFiles/testfile1.txt'); // 创建第一个测试文件
    fs.writeFileSync(filePath1, 'First test file content.');

    const res1 = await request(app)
      .post('/api/uploads')
      .field('studentId', '12345')
      .field('name', 'John Doe')
      .field('className', 'Physics')
      .field('HWnumber', '1')
      .attach('assignmentFile', filePath1); // 上传第一个文件

    expect(res1.status).toBe(200);

    // 检查数据库中是否有相关记录
    const dbResult1 = await pool.query('SELECT * FROM classes WHERE studentnumber = ?', [12345]);
    expect(dbResult1[0].studentname).toBe('John Doe');

    // 记录第一个文件的哈希名
    const hashFilename1 = dbResult1[0].filename;
    const uploadedFilePath1 = path.join(__dirname, '..', hashFilename1); // 计算完整路径
    testFiles.push(uploadedFilePath1); // 记录哈希文件路径

    // 上传第二个同名文件
    const filePath2 = path.join(__dirname, './testFiles/testfile1_copy.txt'); // 创建第二个不同名称的测试文件
    fs.writeFileSync(filePath2, 'Second test file content.');

    const res2 = await request(app)
      .post('/api/uploads')
      .field('studentId', '12345')
      .field('name', 'John Doe')
      .field('className', 'Physics')
      .field('HWnumber', '1')
      .attach('assignmentFile', filePath2); // 上传第二个文件

    expect(res2.status).toBe(200);

    // 重新查询数据库以确保获取到第二个文件的哈希名
    const dbResult2 = await pool.query('SELECT * FROM classes WHERE studentnumber = ?', [12345]);
    expect(dbResult2.length).toBe(2); // 确保有两条记录

    // 记录第二个文件的哈希名
    const hashFilename2 = dbResult2[1].filename; // 假设第二个文件在数组中的位置
    const uploadedFilePath2 = path.join(__dirname, '..', hashFilename2); // 计算完整路径
    testFiles.push(uploadedFilePath2); // 记录哈希文件路径
  });
});
