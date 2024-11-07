const checkRole = (requiredRole) => {
    return (req, res, next) => {
      const { role } = req.user; // 从 req.user 获取角色信息
      console.log(role);
  
      if (role !== requiredRole) {
        return res.status(403).json({ message: "权限不足，无法访问该资源" });
      }

      next(); // 如果角色匹配，继续处理请求
    };
  };
  
  module.exports = checkRole;
  