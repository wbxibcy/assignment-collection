const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../utils/db');
const config = require('../config/config');

const login = async (username, password) => {
    // 查询用户信息，包括角色
    const [user] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    
    if (user.length === 0) {
        throw new Error('用户不存在');
    }

    // 比对密码
    const validPassword = await bcrypt.compare(password, user[0].password);
    if (!validPassword) {
        throw new Error('密码错误');
    }

    // 获取用户的角色信息
    const { id, username: userName, role } = user[0];

    // 生成 JWT，包含用户的角色信息
    const token = jwt.sign({ userId: id, username: userName, role }, config.jwtSecret, { expiresIn: '1h' });

    // 返回包含 token 和角色信息
    return { token, role };
};

module.exports = { login };
