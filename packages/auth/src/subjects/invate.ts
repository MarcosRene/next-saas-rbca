import { z } from 'zod'

export const invateSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('get'),
    z.literal('create'),
    z.literal('revoke'),
  ]),
  z.literal('Invate'),
])

export type InvateSubject = z.infer<typeof invateSubject>
