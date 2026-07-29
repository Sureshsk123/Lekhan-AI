import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LangSphere Enterprise API Documentation',
      version: '2.0.0',
      description: 'Complete Phase 1 to Phase 4B REST & Intelligent Learning Engine API documentation powered by Node.js, Express, MongoDB Atlas, and Gemini AI.',
      contact: {
        name: 'LangSphere Software Architecture Team'
      }
    },
    servers: [
      {
        url: 'http://localhost:5001',
        description: 'Local Development Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format: Bearer <token>'
        }
      },
      schemas: {
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Operation successful' },
            data: { type: 'object' },
            errors: { type: 'array', items: { type: 'object' }, example: [] }
          }
        },
        LearningProfile: {
          type: 'object',
          properties: {
            weakAlphabets: { type: 'array', items: { type: 'object' } },
            weakPronunciation: { type: 'array', items: { type: 'object' } },
            weakHandwriting: { type: 'array', items: { type: 'object' } },
            recommendations: { type: 'array', items: { type: 'object' } }
          }
        },
        SmartDashboard: {
          type: 'object',
          properties: {
            xpMetrics: { type: 'object' },
            learningMetrics: { type: 'object' },
            languageProficiency: { type: 'object' },
            heatmap: { type: 'array', items: { type: 'object' } }
          }
        },
        Notification: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            message: { type: 'string' },
            type: { type: 'string' },
            read: { type: 'boolean' }
          }
        },
        ReportLog: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            reportType: { type: 'string' },
            summaryMetrics: { type: 'object' },
            pdfUrl: { type: 'string' }
          }
        }
      }
    },
    paths: {
      '/api/health': {
        get: {
          tags: ['System'],
          summary: 'Health Check',
          responses: { 200: { description: 'API Healthy' } }
        }
      },
      '/api/personalized/profile': {
        get: {
          tags: ['Personalized Learning'],
          summary: 'Get AI Weak Topics & Smart Recommendations',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Personalized Profile' } }
        }
      },
      '/api/dashboard/smart': {
        get: {
          tags: ['Smart Dashboard'],
          summary: 'Get Analytics, Heatmaps, Hours & XP Breakdown',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Smart Dashboard Data' } }
        }
      },
      '/api/notifications': {
        get: {
          tags: ['Notifications'],
          summary: 'Get Notifications List & Unread Count',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Notifications' } }
        }
      },
      '/api/parent/link-child': {
        post: {
          tags: ['Parent Dashboard'],
          summary: 'Link Child Account to Parent Dashboard',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Child Linked' } }
        }
      },
      '/api/parent/dashboard/{childId}': {
        get: {
          tags: ['Parent Dashboard'],
          summary: 'Get Detailed Child Dashboard',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'childId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Child Dashboard Data' } }
        }
      },
      '/api/admin/dashboard': {
        get: {
          tags: ['Admin Dashboard'],
          summary: 'Get Admin System Overview Metrics',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Admin Metrics' } }
        }
      },
      '/api/admin/users': {
        get: {
          tags: ['Admin Dashboard'],
          summary: 'List All Users with Filters & Search',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Users List' } }
        }
      },
      '/api/search': {
        get: {
          tags: ['Search Engine'],
          summary: 'Global Search across Lessons, Stories, Vocab, Users, Shop, Achievements',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'q', in: 'query', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Global Search Results' } }
        }
      },
      '/api/reports/generate': {
        post: {
          tags: ['Reporting'],
          summary: 'Generate Weekly or Monthly Report',
          security: [{ bearerAuth: [] }],
          responses: { 201: { description: 'Report Generated' } }
        }
      },
      '/api/reports/export-pdf/{reportId}': {
        get: {
          tags: ['Reporting'],
          summary: 'Export Formatted PDF Document for Report',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'reportId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'PDF Document Exported' } }
        }
      }
    }
  },
  apis: []
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app) => {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'LangSphere Enterprise API Docs',
    swaggerOptions: { persistAuthorization: true }
  }));
  console.log('📑 Swagger documentation initialized at /api/docs');
};

export default setupSwagger;
