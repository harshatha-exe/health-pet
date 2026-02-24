import type { Metadata, Viewport } from 'next'
import { Press_Start_2P, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _pressStart = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-mono',
})

const _inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'LifePet - Your Body is the Controller',
  description: 'Your lifestyle controls your creature. Enter your daily habits, generate a unique creature, and battle to see how your health choices perform.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  themeColor: '#1a1a2e',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${_pressStart.variable} ${_inter.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
