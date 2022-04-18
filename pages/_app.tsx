import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { AuthProvider } from '../hooks/useAuth'
import { SnackbarProvider } from 'notistack'
import { RecoilRoot } from 'recoil'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <SnackbarProvider
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </SnackbarProvider>
    </RecoilRoot>
    //HOC high order components
  )
}

export default MyApp
