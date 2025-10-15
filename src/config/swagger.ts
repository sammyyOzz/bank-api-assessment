import swaggerJsdoc from 'swagger-jsdoc';
import { port } from './config';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Bank API Documentation',
      version: '1.0.0',
      description: 'A comprehensive banking API for managing accounts, transactions, and users',
      contact: {
        name: 'API Support',
        email: 'support@bankapi.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: `http://localhost:${port}/api`,
        description: 'Development server',
      },
      {
        url: 'https://api.production.com/api',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Error message',
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            firstName: {
              type: 'string',
              example: 'John',
            },
            lastName: {
              type: 'string',
              example: 'Doe',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john.doe@example.com',
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              example: 'user',
            },
            isActive: {
              type: 'boolean',
              example: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Account: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            userId: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            accountNumber: {
              type: 'string',
              example: 'ACC1234567890',
            },
            accountName: {
              type: 'string',
              example: 'John Doe',
            },
            balance: {
              type: 'number',
              example: 5000.0,
            },
            currency: {
              type: 'string',
              example: 'USD',
            },
            status: {
              type: 'string',
              enum: ['active', 'suspended', 'closed'],
              example: 'active',
            },
          },
        },
        Transaction: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            fromAccountId: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            toAccountId: {
              type: 'string',
              example: '507f1f77bcf86cd799439012',
            },
            type: {
              type: 'string',
              enum: ['transfer', 'deposit', 'withdrawal', 'payment', 'refund'],
              example: 'transfer',
            },
            amount: {
              type: 'number',
              example: 100.0,
            },
            currency: {
              type: 'string',
              example: 'USD',
            },
            description: {
              type: 'string',
              example: 'Payment for services',
            },
            status: {
              type: 'string',
              enum: ['pending', 'completed', 'failed'],
              example: 'completed',
            },
            transactionReference: {
              type: 'string',
              example: 'TXN1234567890',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            page: {
              type: 'integer',
              example: 1,
            },
            limit: {
              type: 'integer',
              example: 10,
            },
            total: {
              type: 'integer',
              example: 100,
            },
            pages: {
              type: 'integer',
              example: 10,
            },
            hasNext: {
              type: 'boolean',
              example: true,
            },
            hasPrev: {
              type: 'boolean',
              example: false,
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/modules/**/*.routes.ts', './src/modules/**/*.controller.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
