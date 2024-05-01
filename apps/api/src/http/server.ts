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

import { errorHandler } from './errorHandler'

import { createAccount } from './routes/auth/createAccount'
import { authenticateWithPassword } from './routes/auth/authenticateWithPassword'
import { authenticateWithGithub } from './routes/auth/authenticateWithGithub'
import { getProfile } from './routes/auth/getProfile'
import { requestPasswordRecover } from './routes/auth/requestPasswordRecover'
import { resetPassword } from './routes/auth/resetPassword'
import { createOrganization } from './routes/orgs/createOrganization'
import { getMembership } from './routes/orgs/getMembership'
import { getOrganization } from './routes/orgs/getOraganization'
import { getOrganizations } from './routes/orgs/getOrganizations'
import { updateOrganization } from './routes/orgs/upateOrganization'
import { shutdownOrganization } from './routes/orgs/shutdownOrganization'
import { transferOrganization } from './routes/orgs/transferOrganization'
import { createProject } from './routes/projects/createProject'
import { deleteProject } from './routes/projects/deleteProject'
import { getProject } from './routes/projects/getProject'
import { getProjects } from './routes/projects/getProjects'
import { updateProject } from './routes/projects/updateProject'
import { getMembers } from './routes/members/getMembers'
import { updateMember } from './routes/members/updateMember'
import { removeMember } from './routes/members/removeMember'
import { createInvite } from './routes/invites/createInvite'
import { getInvite } from './routes/invites/getInvite'
import { getInvites } from './routes/invites/getInvites'
import { acceptInvite } from './routes/invites/acceptInvite'
import { rejectInvite } from './routes/invites/rejectInvite'
import { revokeInvite } from './routes/invites/revokeInvite'
import { getPendingInvites } from './routes/invites/getPendingInvites'
import { getOrganizationBilling } from './routes/billing/getOrganizationBilling'

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

app.register(createProject)
app.register(deleteProject)
app.register(getProject)
app.register(getProjects)
app.register(updateProject)

app.register(getMembers)
app.register(updateMember)
app.register(removeMember)

app.register(createInvite)
app.register(getInvite)
app.register(getInvites)
app.register(acceptInvite)
app.register(rejectInvite)
app.register(revokeInvite)
app.register(getPendingInvites)

app.register(getOrganizationBilling)

app
  .listen({
    port: env.SERVER_PORT,
  })
  .then(() => {
    console.log('HTTP server running!')
  })
