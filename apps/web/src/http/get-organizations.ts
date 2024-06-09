import { api } from './api-client'

type Organization = {
  id: string
  name: string
  slug: string
  avatarUrl: string | null
}

interface GetOrganizationResponses {
  organizations: Organization[]
}

export async function getOrganizations() {
  const result = await api.get('organizations').json<GetOrganizationResponses>()

  return result
}
