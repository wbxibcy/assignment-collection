// swagger.js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger 配置选项
const options = {
  definition: {
    openapi: '3.0.0', // OpenAPI 3.0 规范
    info: {
      title: 'API 文档',
      version: '1.0.0',
      description: 'API 接口文档',
    },
    servers: [
        {
          url: 'http://localhost:3030',
        },
      ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = {
  swaggerSpec,
  swaggerUi,
};
