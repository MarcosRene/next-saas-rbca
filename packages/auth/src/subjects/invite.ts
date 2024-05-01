import { z } from 'zod'

export const inviteSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('get'),
    z.literal('create'),
    z.literal('revoke'),
  ]),
  z.literal('Invite'),
])

export type InvateSubject = z.infer<typeof inviteSubject>
