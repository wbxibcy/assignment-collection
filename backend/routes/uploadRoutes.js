const express = require('express');
const { uploadController } = require('../controllers/uploadController');
const upload = require('../services/fileService');
const auth = require('../middlewares/auth');
const checkRole = require('../middlewares/checkRole');

const router = express.Router();

/**
 * @swagger
 * /uploads:
 *   post:
 *     summary: 上传作业文件
 *     tags:
 *       - Upload
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - assignmentFile
 *               - name
 *               - className
 *               - HWnumber
 *             properties:
 *               assignmentFile:
 *                 type: string
 *                 format: binary
 *                 description: 要上传的作业文件
 *               name:
 *                 type: string
 *                 description: 学生的用户名
 *               className:
 *                 type: string
 *                 description: 学生的课程名称
 *               HWnumber:
 *                 type: integer
 *                 description: 作业编号
 *     responses:
 *       200:
 *         description: 文件上传并记录成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 文件上传并记录成功
 *                 file:
 *                   type: string
 *                   description: 上传的文件名
 *                 dbResult:
 *                   type: object
 *                   properties:
 *                     affectedRows:
 *                       type: integer
 *                       description: 插入操作影响的行数
 *                       example: 1
 *                     insertId:
 *                       type: integer
 *                       description: 插入操作返回的 ID
 *                       example: 123
 *       400:
 *         description: 未上传文件
 *       404:
 *         description: 未找到指定的学生或课程
 *       500:
 *         description: 数据库操作失败
 *       x-role:
 *         description: 此 API 仅限“student”角色访问
 */

// POST 路由，用于文件上传
router.post('/', auth, checkRole('student'), upload.single('assignmentFile'), uploadController);

module.exports = router;