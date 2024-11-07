const express = require('express');
const { downloadHomework } = require('../controllers/downloadController');
const auth = require('../middlewares/auth');
const checkRole = require('../middlewares/checkRole');

const router = express.Router();

/**
 * @swagger
 * /download:
 *   get:
 *     summary: 下载指定班级和作业编号的作业文件并压缩为ZIP
 *     description: 根据 `class_name` 和 `homework_number` 下载最新提交的作业文件，并压缩为 ZIP 文件。
 *     tags:
 *       - Downloads
 *     security:
 *       - bearerAuth: []  # 使用 Bearer Token 进行身份验证
 *     parameters:
 *       - in: query
 *         name: class_name
 *         schema:
 *           type: string
 *         required: true
 *         description: 班级名称
 *       - in: query
 *         name: homework_number
 *         schema:
 *           type: integer
 *         required: true
 *         description: 作业编号
 *     responses:
 *       200:
 *         description: 成功下载 ZIP 文件
 *         content:
 *           application/zip:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: 请求参数缺失
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 班级名和作业编号不能为空
 *       404:
 *         description: 找不到相关的作业文件
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 没有找到相关作业文件
 *       500:
 *         description: 服务器错误
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 服务器错误
 *       x-role:
 *         description: 此 API 仅限“teacher”角色访问
 */

// 下载作业文件并压缩为zip
router.get('/', auth, checkRole('teacher'), downloadHomework);

module.exports = router;
