import type { Metadata } from 'next'

import { ReactQueryProvider, Toast } from '@/app/components'
import { AuthProvider } from '@/features/auth'

import './globals.css'

export const metadata: Metadata = {
  title: 'SuperTalents',
  description:
    'At SuperTalents, we connect top professionals with dynamic businesses. Using AI and Web3, we’re changing how talent meets opportunity, empowering everyone to showcase their unique skills and value the power of networks.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body className='flex flex-col min-h-screen bg-gray-900 font-mona-sans text-white'>
        <ReactQueryProvider>
          <AuthProvider>
          </AuthProvider>
          <Toast />
        </ReactQueryProvider>
      </body>
    </html>
  )
}
