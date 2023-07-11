import './globals.css'
import type { Metadata } from 'next'

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
      <body className='font-mona-sans text-white'>{children}</body>
    </html>
  )
}
