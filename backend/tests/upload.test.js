const request = require('supertest');
const app = require('../app');
const fs = require('fs');
const path = require('path');

// 测试文件上传 API
describe('POST /api/uploads', () => {

  it('should upload a file and return success message', async () => {
    // 模拟请求数据
    const response = await request(app)
      .post('/api/uploads')  // 测试上传路由
      .field('studentId', '123456')
      .field('name', '张三')
      .field('className', '21软四')
      .attach('assignmentFile', path.join(__dirname, 'testFiles/samples.ipynb'));

    // 检查返回结果
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('File uploaded successfully.');

    // 检查文件是否保存
    const uploadedFilePath = path.join(__dirname, '../uploads/123456_张三_21软四.ipynb');
    expect(fs.existsSync(uploadedFilePath)).toBe(true);

    // 清理：删除上传的测试文件
    fs.unlinkSync(uploadedFilePath);
  });

  it('should return an error if no file is uploaded', async () => {
    const response = await request(app)
      .post('/api/uploads')
      .field('studentId', '123456')
      .field('name', '张三')
      .field('className', '21软四');

    expect(response.status).toBe(400);
    expect(response.text).toBe('No file uploaded.');
  });
});
