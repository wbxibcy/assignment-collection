const express = require('express');
const { loginController } = require('../controllers/authController');

const router = express.Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: 用户登录
 *     description: 通过用户名和密码进行用户登录，返回 JWT token。
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: 用户名
 *                 example: student1
 *               password:
 *                 type: string
 *                 description: 密码
 *                 example: password123
 *     responses:
 *       200:
 *         description: 登录成功，返回 JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token
 *       401:
 *         description: 用户名或密码错误
 *       500:
 *         description: 服务器错误
 */

// 登录路由
router.post('/login', loginController);

module.exports = router;
