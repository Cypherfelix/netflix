import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth'

import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { auth } from '../firebase'
import { useSnackbar } from 'notistack'
import { useRecoilState } from 'recoil'
import { isSignUpState } from '../atom/loginAtom'
interface IAuth {
  user: User | null
  signUp: (email: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  reset: (email: string, email2: string) => Promise<void>
  error: string | null
  loading: boolean
}

const AuthContext = createContext<IAuth>({
  user: null,
  signUp: async () => {},
  signIn: async () => {},
  logout: async () => {},
  reset: async () => {},
  error: null,
  loading: false,
})

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [initialLoading, setInitialLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const [isSignUp, setIsSignUp] = useRecoilState(isSignUpState)

  useEffect(
    () =>
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // Logged in...
          setUser(user)
          setLoading(false)
        } else {
          // Not logged in...
          setUser(null)
          setLoading(true)
          router.push('/login')
          setIsSignUp(false)
          setLoading(false)
        }

        setInitialLoading(false)
      }),
    [auth]
  )

  const reset = async (email: string, email2: string) => {
    setLoading(true)
  }

  const signUp = async (email: string, password: string) => {
    setLoading(true)

    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        setUser(userCredentials.user)
        router.push('/')
        closeSnackbar()
        enqueueSnackbar('Account Created Successfully', {
          variant: 'success',
          preventDuplicate: true,
          autoHideDuration: 2000,
        })

        setLoading(false)
      })
      .catch((error) => {
        setError(error.message)
        console.log(error.message)
        if (error.message == 'Firebase: Error (auth/email-already-in-use).') {
          closeSnackbar()
          enqueueSnackbar(
            'Account Already Created with Email. Try Signing in',
            {
              variant: 'error',
              preventDuplicate: true,
              autoHideDuration: 2000,
            }
          )
        } else {
          closeSnackbar()
          enqueueSnackbar('Something Went Wrong', {
            variant: 'error',
            preventDuplicate: true,
            autoHideDuration: 2000,
          })
        }
      })
      .finally(() => setLoading(false))
  }

  const signIn = async (email: string, password: string) => {
    setLoading(true)

    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        setUser(userCredentials.user)
        router.push('/')
        closeSnackbar()
        enqueueSnackbar('Login Successfull', {
          variant: 'success',
          preventDuplicate: true,
          autoHideDuration: 2000,
        })

        setLoading(false)
      })
      .catch((error) => {
        if (error.message == 'Firebase: Error (auth/wrong-password).') {
          closeSnackbar()
          enqueueSnackbar('Incorrect Email or Password', {
            variant: 'error',
            preventDuplicate: true,
            autoHideDuration: 2000,
          })
        } else if (error.code == 'auth/user-not-found') {
          closeSnackbar()
          enqueueSnackbar('No Account Found accociated with Email. Sign Up', {
            variant: 'error',
            preventDuplicate: true,
            autoHideDuration: 2000,
          })
        } else if (error.code == 'auth/too-many-requests') {
          closeSnackbar()
          enqueueSnackbar('Too many Incorrect attempts. Try Later', {
            variant: 'error',
            preventDuplicate: true,
            autoHideDuration: 2000,
          })
        } else {
          closeSnackbar()
          enqueueSnackbar('Something Went Wrong', {
            variant: 'error',
            preventDuplicate: true,
            autoHideDuration: 2000,
          })
        }
        setError(error.message)
      })
      .finally(() => setLoading(false))
  }
  

  const logout = async () => {
    setLoading(true)

    signOut(auth)
      .then(() => {
        setUser(null)
        closeSnackbar()
        enqueueSnackbar('Logout Successfull', {
          variant: 'success',
          preventDuplicate: true,
          autoHideDuration: 2000,
        })
        setLoading(false)
      })
      .catch((error) => {
        closeSnackbar()
        enqueueSnackbar('Something Went Wrong', {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 2000,
        })
        setError(error.message)
      })
      .finally(() => setLoading(false))
  }

  const memoedValue = useMemo(
    () => ({
      user,
      signUp,
      signIn,
      error,
      loading,
      logout,
      reset,
    }),
    [user, loading, error]
  )

  return (
    <AuthContext.Provider value={memoedValue}>
      {!initialLoading && children}
    </AuthContext.Provider>
  )
}

export default function useAuth() {
  return useContext(AuthContext)
}
