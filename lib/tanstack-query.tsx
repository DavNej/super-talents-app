'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

function defaultOnError(err: unknown, variables?: unknown, context?: unknown) {
  console.error(err)

  if (variables) {
    console.error({ variables })
  }
  if (context) {
    console.error({ context })
  }
}

export default function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        onError: defaultOnError,
      },
      mutations: {
        onError: defaultOnError,
      },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
