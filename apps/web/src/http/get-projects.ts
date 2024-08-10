import { api } from './api-client'

type Project = {
  description: string
  slug: string
  id: string
  name: string
  avatarUrl: string | null
  organizationId: string
  ownerId: string
  createdAt: string
  owner: {
    id: string
    name: string | null
    avatarUrl: string | null
  }
}

interface GetProjectsResponse {
  projects: Project[]
}

export async function getProjects(org: string) {
  const result = await api
    .get(`organizations/${org}/projects`)
    .json<GetProjectsResponse>()

  return result
}
