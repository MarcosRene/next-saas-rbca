import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { BadRequestError } from '@/http/routes/_errors/bagRequestError'
import { UnauthorizedError } from '@/http/routes/_errors/unauthorizedError'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/getUserPermissions'
import { roleSchema } from '@saas/auth'

export async function getMembers(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/members',
      {
        schema: {
          tags: ['Members'],
          summary: 'Get all organization members',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              members: z.array(
                z.object({
                  userId: z.string().uuid(),  
                  id: z.string().uuid(),  
                  role: roleSchema,
                  name: z.string().nullable(),
                  email: z.string().email(),
                  avatarUrl: z.string().url().nullable(),
                })
              )
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const userId = await request.getCurrentUserId()
        const { organization, membership } =
          await request.getUserMemberShip(slug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('get', 'User')) {
          throw new UnauthorizedError(
            `You're not allowed to see oganization members.`,
          )
        }

        const members = await prisma.member.findMany({
          select: {
            id: true,
            role: true, 
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
              }
            }
          },
          where: {
            organizationId: organization.id,
          },
          orderBy: {
            role: 'asc'
          }
        })

        const membersWithRoles = members.map(({ user: { id: userId, ...user }, ...member }) => ({
          ...user,
          ...member,
          userId,
        }))

        return reply.send({ members: membersWithRoles })
      },
    )
}