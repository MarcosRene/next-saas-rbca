import { hash } from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

import { BadRequestError } from '../_errors/bagRequestError'

export async function createAccount(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/users',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Create a new account',
        body: z.object({
          name: z.string(),
          email: z.string().email(),
          password: z.string().min(6),
        }),
      },
    },
    async (request, reply) => {
      const { name, email, password } = request.body

      const userWithSomeEmail = await prisma.user.findUnique({
        where: { email },
      })

      if (userWithSomeEmail) {
        throw new BadRequestError('user with some e-mail already exists.')
      }

      const [, domain] = email.split('@')

      const autoJoinOrnaginzation = await prisma.organization.findFirst({
        where: {
          domain,
          shouldAttachUsersByDomain: true,
        },
      })

      const passwordHash = await hash(password, 6)

      await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
          member_on: autoJoinOrnaginzation
            ? {
                create: {
                  organizationId: autoJoinOrnaginzation.id,
                },
              }
            : undefined,
        },
      })

      return reply.status(201).send()
    },
  )
}
