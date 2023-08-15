import './globals.css'
import Providers from '@/components/Providers'
import Sidebar from "../components/Sidebar/Sidebar"
import { Montserrat } from "next/font/google"
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'

export const metadata = {
  title: 'Cluster',
  description: 'A group manager app',
  icons: {
    rel: 'icon',
  }
}

const roboto = Montserrat({ subsets: ['latin'], weight: ['400'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const queryClient = new QueryClient()
  return (
    <html lang="en">
      <body className={roboto.className}>

        <Providers>

          <Sidebar />
          {children}


        </Providers>

      </body>
    </html>
  )
}
