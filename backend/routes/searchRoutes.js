const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const auth = require('../middlewares/auth');
const checkRole = require('../middlewares/checkRole');

/**
 * @swagger
 * /search:
 *   get:
 *     summary: 搜索指定班级和作业编号的文件
 *     description: 根据班级名称和作业编号搜索最新上传的作业文件信息。
 *     tags:
 *       - Search
 *     security:
 *       - bearerAuth: []  # 使用 Bearer Token 进行身份验证
 *     parameters:
 *       - in: query
 *         name: classname
 *         schema:
 *           type: string
 *         required: true
 *         description: 班级名称
 *       - in: query
 *         name: hwnumber
 *         schema:
 *           type: integer
 *         required: true
 *         description: 作业编号
 *     responses:
 *       200:
 *         description: 成功返回查询到的文件信息
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 查询成功
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       studentname:
 *                         type: string
 *                         description: 学生姓名
 *                       studentnumber:
 *                         type: string
 *                         description: 学生学号
 *                       filename:
 *                         type: string
 *                         description: 文件名
 *                       hwnumber:
 *                         type: integer
 *                         description: 作业编号
 *                       classname:
 *                         type: string
 *                         description: 班级名称
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         description: 文件上传时间，格式为 yyyy-MM-dd HH:mm:ss
 *       400:
 *         description: 请求参数缺失
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 请提供课程名称和作业编号
 *       404:
 *         description: 找不到符合条件的文件
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 未找到符合条件的文件
 *       500:
 *         description: 服务器错误
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 服务器错误，请稍后再试
 *       x-role:
 *         description: 此 API 仅限“teacher”角色访问
 */

// 定义搜索文件的路由
router.get('/', auth, checkRole('teacher'), searchController.searchFiles);

module.exports = router;
