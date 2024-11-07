const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { importStudentsFromExcel } = require("../controllers/studentController");
const auth = require('../middlewares/auth');
const checkRole = require('../middlewares/checkRole');

const router = express.Router();

/**
 * @swagger
 * /students/import-students:
 *   post:
 *     summary: 导入学生信息
 *     description: 通过上传 Excel 文件批量导入学生信息，文件上传成功后返回一个包含插入成功和已存在学生信息的 Excel 文件。
 *     tags:
 *       - Import student information
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: 包含学生信息的 Excel 文件
 *     responses:
 *       200:
 *         description: 成功导入学生信息并生成结果文件
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *               description: 生成的 Excel 文件，包含插入成功和已存在学生的信息
 *       400:
 *         description: 无效的请求或上传文件缺失
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 请上传文件
 *       401:
 *         description: 未授权，用户未登录或身份无效
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 未授权访问
 *       403:
 *         description: 禁止访问，用户无访问权限
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 无权限访问该资源
 *       500:
 *         description: 服务器错误，导入失败
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 导入失败
 *                 error:
 *                   type: string
 *                   description: 服务器错误的详细信息
 *       x-role:
 *         description: 此 API 仅限“teacher”角色访问
 */

// 设置文件上传存储路径和文件名
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads"); // 文件存储路径
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // 确保文件名唯一
  },
});

// 上传的配置
const upload = multer({ storage });

// 上传学生信息的 API
router.post("/import-students", auth, checkRole('teacher'), upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path; // 获取上传文件的路径
    const filePathToSend = await importStudentsFromExcel(filePath); // 调用导入函数并生成结果文件
    console.log(filePathToSend);

    // 设置响应头，返回文件
    res.download(filePathToSend, (err) => {
      if (err) {
        console.error("文件下载失败", err);
        res.status(500).json({ message: "文件下载失败" });
      } else {
        fs.unlinkSync(filePathToSend);
      }
    });
  } catch (error) {
    console.error("导入学生信息失败", error);
    res.status(500).json({ message: "导入失败", error: error.message });
  }
});

module.exports = router;
