import { Role } from '@saas/auth'

import { api } from './api-client'

type Member = {
  id: string
  userId: string
  role: Role
  name: string | null
  email: string
  avatarUrl: string | null
}

interface GetMembersResponse {
  members: Member[]
}

export async function getMembers(org: string) {
  const result = await api
    .get(`organizations/${org}/members`, {
      next: {
        tags: [`${org}/members`],
      },
    })
    .json<GetMembersResponse>()

  return result
}
