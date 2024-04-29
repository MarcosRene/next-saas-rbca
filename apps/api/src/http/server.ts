import fastifyCors from '@fastify/cors'
import fastifySwagger from '@fastify/swagger'
import fastifyJwt from '@fastify/jwt'
import fastifySwaggerUI from '@fastify/swagger-ui'
import { fastify } from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { env } from '@saas/env'

import { createAccount } from './routes/auth/createAccount'
import { authenticateWithPassword } from './routes/auth/authenticateWithPassword'
import { authenticateWithGithub } from './routes/auth/authenticateWithGithub'
import { getProfile } from './routes/auth/getProfile'
import { errorHandler } from './errorHandler'
import { requestPasswordRecover } from './routes/auth/requestPasswordRecover'
import { resetPassword } from './routes/auth/resetPassword'
import { createOrganization } from './routes/orgs/createOrganization'
import { getMembership } from './routes/orgs/getMembership'
import { getOrganization } from './routes/orgs/getOraganization'
import { getOrganizations } from './routes/orgs/getOrganizations'
import { updateOrganization } from './routes/orgs/upateOrganization'
import { shutdownOrganization } from './routes/orgs/shutdownOrganization'
import { transferOrganization } from './routes/orgs/transferOrganization'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.setErrorHandler(errorHandler)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Next.js SaaS',
      description: 'Full-stack SaaS with multi-tenant & RBAC.',
      version: '1.0.0',
    },
   components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
   }
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUI, {
  routePrefix: '/docs',
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(fastifyCors)

app.register(createAccount)
app.register(authenticateWithPassword)
app.register(authenticateWithGithub)
app.register(getProfile)
app.register(requestPasswordRecover)
app.register(resetPassword)

app.register(createOrganization)
app.register(getMembership)
app.register(getOrganization)
app.register(getOrganizations)
app.register(updateOrganization)
app.register(shutdownOrganization)
app.register(transferOrganization)

app
  .listen({
    port: env.SERVER_PORT,
  })
  .then(() => {
    console.log('HTTP server running!')
  })
