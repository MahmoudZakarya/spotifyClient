import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { NextUIProvider } from '@nextui-org/react'
import { RecoilRoot } from 'recoil'

function MyApp({ Component, pageProps: {session, ...pageProps} }: AppProps) {
  return (
<SessionProvider session={session}>
  <RecoilRoot>
    <NextUIProvider>
  <Component {...pageProps} />
  </NextUIProvider>
 </RecoilRoot>
</SessionProvider>)
}

export default MyApp
