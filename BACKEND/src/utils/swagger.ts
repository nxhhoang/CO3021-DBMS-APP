import { Express } from 'express'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import path from 'path'

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-commerce API',
      version: '1.0.0',
      description: 'API documentation for the E-commerce system'
    },
    servers: [
      {
        url: '/api/v1',
        description: 'API v1'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token'
        }
      }
    },
    security: [
      {
        BearerAuth: []
      }
    ]
  },
  // Search for documentation in YAML files within the openapi directory
  apis: [path.resolve(__dirname, '../../openapi/*.yaml')]
}

const swaggerSpec = swaggerJsdoc(options)

/**
 * Initialize Swagger documentation on the Express application
 * @param app Express application instance
 */
export const setupSwagger = (app: Express) => {
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        filter: true
      },
      customSiteTitle: 'E-commerce API Documentation'
    })
  )

  console.log('Swagger documentation initialized at /api-docs')
}
