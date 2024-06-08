import { api } from './api-client'

type User = {
  id: string
  name: string | null
  email: string
  avatarURL: string | null
}

interface GetProfileResponse {
  user: User
}

export async function getProfile() {
  const result = await api.get('profile').json<GetProfileResponse>()

  return result
}
