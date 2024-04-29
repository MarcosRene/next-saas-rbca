import { organizationSchema } from '@saas/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/getUserPermissions'

import { UnauthorizedError } from '../_errors/unauthorizedError'
import { BadRequestError } from '../_errors/bagRequestError'

export async function updateOrganizations(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().register(auth).put('/organizations/:slug', {
    schema: {
      tags: ['Organizations'],
      summary: 'Update organization details',
      security: [{ bearerAuth: [] }],
      body: z.object({
        name: z.string(),
        domain: z.string().nullable(),
        shouldAttachUsersByDomain: z.boolean().optional(),
      }),
      params: z.object({
        slug: z.string(),
      }),
      response: {
        201: z.object({
          organizationId: z.string().uuid()
        })
      },
    },
  }, async (request, reply) => {
    const { slug } = request.params

    const userId = await request.getCurrentUserId()
    const { membership, organization } = await request.getUserMemberShip(slug)

    const { name, domain, shouldAttachUsersByDomain } = request.body

    const authOrganization = organizationSchema.parse(organization)

    const { cannot } = getUserPermissions(userId, membership.role)

    if (cannot('update', authOrganization)) {
      throw new UnauthorizedError(`You're not allowed to update this organization.`)
    }

    if (domain) {
      const organizationByDomain = await prisma.organization.findFirst({
        where: { 
          domain, 
          id: { 
            not: organization.id 
          } 
        }
      })

      if (organizationByDomain) {
        throw new BadRequestError('Another organization with same domain already exists.')
      }
    }

    await prisma.organization.update({
      where: {
        id: organization.id,
      },
      data: {
        name,
        domain,
        shouldAttachUsersByDomain,
      }
    })

    return reply.status(204).send()
  })
}