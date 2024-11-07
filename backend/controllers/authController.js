const authService = require('../services/authService');

const loginController = async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const { token } = await authService.login(username, password);
        res.json({ message: '登录成功', token });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

module.exports = { loginController };
