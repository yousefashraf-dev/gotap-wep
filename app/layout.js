import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata = {
  title: 'GoTap.eg — Smart NFC Profile',
  description: 'Your smart profile page',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="ltr" className={inter.className}>
      <body className="antialiased">{children}</body>
    </html>
  )
}
