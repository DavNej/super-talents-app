import type { Metadata } from 'next'

import { Web3AuthProvider } from '@/app/hooks/web3auth'
import { ProfileProvider } from '@/app/hooks/profile'
import { UserProvider } from '@/app/hooks/user'

import Toast from '@/app/components/Toast'
import AppRouter from '@/app/components/AppRouter'
import ReactQueryProvider from '@/lib/tanstack-query'

import './globals.css'

export const metadata: Metadata = {
  title: 'SuperTalents',
  description:
    'At SuperTalents, we’re crafting a space where extraordinary professionals, converge with dynamic businesses. By harnessing the principles of AI and the decentralized ethos of Web3, we’re redefining how talent meets opportunity where he unleashes the inner Super Talent and emphasizing both ownership and the power of professional networks.',
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
          <ProfileProvider>
            <Web3AuthProvider>
              <UserProvider>
                <AppRouter>{children}</AppRouter>
              </UserProvider>
            </Web3AuthProvider>
          </ProfileProvider>

          <Toast />
        </ReactQueryProvider>
      </body>
    </html>
  )
}
