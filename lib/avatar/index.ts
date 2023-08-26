import axios from 'axios'

import { pause } from '@/lib/utils'

import { AVATAR_SERVICE_BASE_URL, headers, buildPayload } from './config'
import type { DataUrlType } from './types'
import { base64ToImgDataUrl } from './utils'

interface IRunpodRes {
  id: string
  status: string
  output?: { image: string }[]
}

async function createJob({ image }: { image: DataUrlType }) {
  console.log('🛠️  Creating job')

  const payload = buildPayload(image)

  try {
    const res = await axios.post<IRunpodRes>(
      `${AVATAR_SERVICE_BASE_URL}/run`,
      payload,
      { headers }
    )
    return res.data
  } catch (err) {
    console.error(err)
    throw '🙈 Could not generate avatar'
  }
}

async function checkJobStatus({ id }: { id: string }) {
  try {
    const res = await axios.get<IRunpodRes>(
      `${AVATAR_SERVICE_BASE_URL}/status/${id}`,
      { headers }
    )
    console.log('🔍 Job', id, res.data.status)
    return res.data
  } catch (err) {
    console.error(err)
    throw '🙈 Could not check avatar status'
  }
}

export async function generateAvatars({ image }: { image: DataUrlType }) {
  console.log('🎨 Generating avatars')

  const job = await createJob({ image })
  await pause(7000)

  if (!job.id) return null
  let res = await checkJobStatus({ id: job.id })

  while (res.status !== 'COMPLETED') {
    await pause(7000)
    res = await checkJobStatus({ id: job.id })
  }

  if (!res.output) return null

  if (res.output.length === 4)
    return res.output?.map(o => base64ToImgDataUrl(o.image)) as DataUrlType[]

  console.error(res.output)
  throw new Error('Something went wrong with the avatar generation')
}
