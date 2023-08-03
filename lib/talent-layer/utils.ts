import fether, { ApiError } from '@/lib/fetcher'
import { config } from './config'

type IResponse = { data: { users: { id: string }[] } }

export async function handleExists(
  handle: string
): Promise<Boolean | ApiError> {
  const query = `
  {
    users(where: {handle_contains_nocase: "${handle}"}, first: 1) {
      id
    }
  }
  `
  const res = await fether.POST<IResponse>(config.subgraphUrl, { query })

  if (!res.ok) {
    return res.error
  }

  return Boolean(res.data.data.users[0])
}
