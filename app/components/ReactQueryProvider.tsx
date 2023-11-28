'use client'

import React from 'react'
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { toast } from 'react-toastify'
import { log } from '@/utils'

function onError(err: unknown) {
  const isTypeError = err instanceof Error && err.message
  toast.error(isTypeError ? err.message : 'Something went wrong')
}

const _queryClient = new QueryClient({
  queryCache: new QueryCache({ onError }),
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
    mutations: { onError },
  },
})

export default function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [queryClient] = React.useState(_queryClient)

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
