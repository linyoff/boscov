import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'API Filmes',
    version: '1.0.0',
    description: 'Documentação da API de usuários e filmes',
  },
  paths: {
    '/user/register': {
      post: {
        summary: 'Cria um novo usuário',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  nome: { type: 'string' },
                  email: { type: 'string' },
                  senha: { type: 'string' },
                  data_nascimento: { type: 'string', format: 'date' }
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Usuário criado com sucesso' },
          400: { description: 'Erro de validação' },
        },
      },
    },
    '/user/login': {
      post: {
        summary: 'Login do usuário',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string' },
                  senha: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Login bem-sucedido' },
          401: { description: 'Credenciais inválidas' },
        },
      },
    },
    '/logado': {
      get: {
        summary: 'Retorna o usuário autenticado',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Usuário autenticado' },
          401: { description: 'Token inválido ou ausente' },
        },
      },
    },
    '/user/logout': {
      post: {
        summary: 'Logout do usuário',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  token: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Logout realizado com sucesso' },
          400: { description: 'Erro ao realizar logout' },
        },
      },
    },
    '/user/recuperar-senha': {
      post: {
        summary: 'Solicita recuperação de senha',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Email de recuperação enviado com sucesso' },
          404: { description: 'Usuário não encontrado' },
        },
      },
    },
    '/user/redefinir-senha': {
      post: {
        summary: 'Redefine a senha com token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  token: { type: 'string' },
                  novaSenha: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Senha redefinida com sucesso' },
          400: { description: 'Token inválido ou expirado' },
        },
      },
    },
    '/user/edit/{id}': {
      put: {
        summary: 'Atualiza os dados do usuário',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  nome: { type: 'string' },
                  email: { type: 'string' },
                  data_nascimento: { type: 'string', format: 'date' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Usuário atualizado com sucesso' },
          400: { description: 'Erro de validação' },
          404: { description: 'Usuário não encontrado' },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [{ bearerAuth: [] }],
};

export function setupSwagger(app: Express) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
