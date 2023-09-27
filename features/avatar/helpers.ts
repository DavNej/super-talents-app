import axios from 'axios'

import type { DataUrlType } from '@/utils/data-url'
import { AVATAR_SERVICE_BASE_URL, headers, buildPayload } from './config'

interface IRunpodRes {
  id: string
  status: string
  output?: { image: string }[]
}

export async function createJob({ image }: { image: DataUrlType }) {
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
    console.error('💥', err)
    throw '🙈 Could not create job'
  }
}

export async function checkJobStatus({ jobId }: { jobId: string }) {
  try {
    const res = await axios.get<IRunpodRes>(
      `${AVATAR_SERVICE_BASE_URL}/status/${jobId}`,
      { headers }
    )
    console.log('🔍 Job', jobId, res.data.status)
    return res.data
  } catch (err) {
    console.error('💥', err)
    throw '🙈 Could not check job status'
  }
}
