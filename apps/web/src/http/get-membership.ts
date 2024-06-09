import { Role } from '@saas/auth'

import { api } from './api-client'

type Membership = {
  id: string
  role: Role
  userId: string
  organizationId: string
}

interface GetMembershipResponses {
  membership: Membership
}

export async function getMemberships(orgSlug: string) {
  const result = await api
    .get(`organizations/${orgSlug}/membership`)
    .json<GetMembershipResponses>()

  return result
}
