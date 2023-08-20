import { toast } from 'react-toastify'
import axios from 'axios'
import { pause } from '@/lib/utils'

import { AVATAR_SERVICE_BASE_URL, headers, buildPayload } from './config'

import type { TImageOutput, IRunpodRes } from './types'
import { base64ToImgDataUrl } from './utils'

async function createJob({ image }: { image: string }) {
  console.log('🛠️  Creating job')

  const payload = buildPayload(image)

  try {
    const res = await axios.post<IRunpodRes>(
      `${AVATAR_SERVICE_BASE_URL}/run`,
      payload,
      { headers }
    )
    return res.data
  } catch (error) {
    toast.error('🙈 Could not generate avatar')
    throw error
  }
}

async function checkJobStatus({ id }: { id: string }) {
  try {
    const res = await axios.get<IRunpodRes>(
      `${AVATAR_SERVICE_BASE_URL}/status/${id}`,
      { headers }
    )
    console.log('🔍 Job', res.data.status)
    return res.data
  } catch (error) {
    toast.error('Could not check avatar status')
    throw error
  }
}

export async function generateAvatars({ image }: { image: string }) {
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
    return res.output?.map(o => base64ToImgDataUrl(o.image)) as TImageOutput

  console.error(res.output)
  throw new Error('Something went wrong with the avatar generation')
}
