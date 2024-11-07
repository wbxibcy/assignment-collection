const jwt = require('jsonwebtoken');
const config = require('../config/config');

// 验证 JWT 的中间件
const auth = (req, res, next) => {
  const token = req.headers["authorization"]?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: "没有提供 token" });
  }

  try {
    console.log(token);
    const decoded = jwt.verify(token, config.jwtSecret); // 验证 JWT
    req.user = decoded; // 将解码后的用户信息保存到 req.user 中
    next(); // 继续处理请求
  } catch (error) {
    console.error("Token 验证失败", error);
    return res.status(401).json({ message: "无效的 token" });
  }
};

module.exports = auth;
