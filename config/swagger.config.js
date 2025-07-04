const swaggerJSDoc = require("swagger-jsdoc");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "User Auth & Role-based API",
      version: "1.0.0",
      description: "API for user registration, login, and RBAC",
    },
    servers: [
      {
        url: "http://localhost:3002",
        description: "Local Server",
      },
      {
        url: "https://auth-node-wshi.onrender.com/",
        description: "Production Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./swagger/*.js"], // You will document endpoints here
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

module.exports = { swaggerDocs };
