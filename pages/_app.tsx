import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { UserProvider } from '@auth0/nextjs-auth0';
import NextNProgress from "nextjs-progressbar"

function MyApp({ Component, pageProps }: AppProps) {
  return <UserProvider><NextNProgress color="#4f46e5" /><Component {...pageProps} /></UserProvider>
}

export default MyApp
