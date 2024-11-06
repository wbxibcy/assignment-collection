const app = require('./app');
const port = 3030;
const alternatePorts = [3031, 3032]; // 可用备用端口数组

const startServer = (portToUse, index = 0) => {
  app.listen(portToUse, () => {
    console.log(`Server running on port ${portToUse}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      if (index < alternatePorts.length) {
        console.error(`Port ${portToUse} is in use. Trying to start on port ${alternatePorts[index]}...`);
        startServer(alternatePorts[index], index + 1); // 尝试下一个备用端口
      } else {
        console.error('All ports are in use. Could not start server.');
      }
    } else {
      console.error('Error starting server:', err);
    }
  });
};

// 启动服务器
startServer(port);
