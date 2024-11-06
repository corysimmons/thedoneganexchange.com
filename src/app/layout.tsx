import { type Metadata } from 'next'

import '~/styles/tailwind.css'

export const metadata: Metadata = {
  title: {
    template: '%s - The Donegan Exchange',
    default: `The Donegan Exchange - One man's curious mind, endless questions, and the journey to find
              answers.`,
  },
  description: `One man's curious mind, endless questions, and the journey to find
              answers.`,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full bg-white antialiased">
      <head>
        <link
          rel="preconnect"
          href="https://cdn.fontshare.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@700,500,400&display=swap"
        />
      </head>
      <body className="flex min-h-full">
        <div className="w-full">{children}</div>
      </body>
    </html>
  )
}
