'use client'

import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { toast } from 'react-toastify'

function defaultOnError(err: unknown, variables?: unknown, context?: unknown) {
  console.log('============')

  console.error(err)

  if (typeof err === 'string') {
    toast.error(err, { toastId: 'root' })
  }

  if (variables) {
    console.error({ variables })
  }

  if (context) {
    console.error({ context })
  }
  console.log('============')
}

export default function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            onError: defaultOnError,
            retry: false,
            refetchOnWindowFocus: false,
          },
          mutations: {
            onError: defaultOnError,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
