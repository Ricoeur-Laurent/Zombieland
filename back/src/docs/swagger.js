
import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Zombieland API',
      version: '1.0.0',
       },
    components: {
      schemas: {
        Attraction: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            image: { type: 'string' },
            description: { type: 'string' },
            slug: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        Attraction_update:{
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            image: { type: 'string' },
            description: { type: 'string' },
            slug: { type: 'string' },
          additionalProperties : false
          },
        },  
      },
    },
  },
  apis: ['./src/routers/*.js', './src/routers/routes/*.js'],
});
