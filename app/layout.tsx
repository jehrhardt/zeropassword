import './globals.css'

export const metadata = {
  title: 'zeropassword',
  description: 'Simple, privacy friendly Web3 log-in based on WebAuthn',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full bg-gray-900">
      <body className="h-full">{children}</body>
    </html>
  )
}
