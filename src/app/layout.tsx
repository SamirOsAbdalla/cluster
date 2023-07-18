import './globals.css'
import Providers from '@/components/Providers'
import Sidebar from "../components/Sidebar/Sidebar"

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const queryClient = new QueryClient()
  return (
    <html lang="en">
      <body >

        <Providers>

          <Sidebar />
          {children}


        </Providers>

      </body>
    </html>
  )
}
