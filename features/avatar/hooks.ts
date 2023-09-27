import React from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useLocalStorage } from 'usehooks-ts'

import api from '@/utils/api'
import type { DataUrlType } from '@/utils/data-url'

type JobId = string

export default function useCreateAvatars() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [_, setAvatars] = useLocalStorage<DataUrlType[]>('avatars', [])

  const createJob = useMutation<
    { jobId: JobId },
    unknown,
    { image: DataUrlType }
  >({
    mutationFn: ({ image }) =>
      api.POST<{ jobId: JobId }>('/api/avatar-gen', { image }),
    onMutate() {
      setIsLoading(true)
    },
  })

  const jobId = createJob.data?.jobId

  const checkJobStatus = useQuery({
    queryKey: ['check-job-status', jobId],
    enabled: Boolean(jobId),
    queryFn: () => {
      if (!jobId) return null
      return api.GET<DataUrlType[] | null>(`/api/avatar-gen?jobId=${jobId}`)
    },
    refetchInterval: isLoading ? 7000 : false,
  })

  React.useEffect(() => {
    if (!isLoading) return

    if (checkJobStatus.isError || checkJobStatus.data) {
      setIsLoading(false)
    }

    if (checkJobStatus.data) {
      setAvatars(checkJobStatus.data)
    }
  }, [checkJobStatus, isLoading, setAvatars])

  return { createAvatar: createJob, isLoading }
}
