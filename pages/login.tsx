import Head from 'next/head'
import Image from 'next/image'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import useAuth from '../hooks/useAuth'
import { CircularProgress } from '@mui/material'
import { useRouter } from 'next/router'
import { useRecoilState } from 'recoil'
import { isSignUpState } from '../atom/loginAtom'

interface Inputs {
  email: string
  password: string
}

interface Props {
  isSignUp: boolean
}

function login() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const [login, setLogin] = useState(false)
  const { signIn, signUp, error, loading } = useAuth()
  const [isSignUp, setIsSignUp] = useRecoilState(isSignUpState)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data)
    if (!isSignUp) {
      await signIn(data.email, data.password)
    } else {
      await signUp(data.email, data.password)
    }
  }

  const onClick = () => {}

  return (
    <div className="relative flex h-screen w-screen bg-black md:items-center md:justify-center md:bg-transparent">
      <Head>
        <title>Login - Netflix</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Image
        src="https://rb.gy/p2hphi"
        layout="fill"
        className="-z-10 !hidden opacity-60 sm:!inline"
        objectFit="cover"
      />
      <img
        src="https://rb.gy/ulxxee"
        className="absolute left-4 top-4 cursor-pointer object-contain md:left-10 md:top-6"
        width={150}
        height={150}
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative mt-24 space-y-8 rounded bg-black/75 py-10 px-6 md:mt-0 md:max-w-md md:px-14"
      >
        <h1 className="text-4xl font-semibold">
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </h1>
        <div className="space-y-4">
          <label className="inline-block w-full ">
            <input
              type="email"
              id="email"
              placeholder="Email"
              className={`input ${
                errors.email && 'border-b-2 border-orange-500'
              }`}
              {...register('email', { required: true })}
            />
            {errors.email && (
              <p className="p-1 text-[13px] font-light  text-orange-500">
                Please enter a valid email.
              </p>
            )}
          </label>
          <label className="inline-block w-full">
            <input
              type="password"
              {...register('password', { required: true })}
              id="password"
              placeholder="Password"
              className={`input ${
                errors.password && 'border-b-2 border-orange-500'
              }`}
            />
            {errors.password && (
              <p className="p-1 text-[13px] font-light  text-orange-500">
                Your password must contain between 4 and 60 characters.
              </p>
            )}
          </label>
        </div>

        {!loading ? (
          <button
            className="w-full rounded bg-[#e50914] py-3 font-semibold"
            onClick={() => setLogin(true)}
          >
            {isSignUp ? 'Register Account' : 'Sign In'}
          </button>
        ) : (
          <CircularProgress></CircularProgress>
        )}

        <div className="text-[gray]">
          {isSignUp ? 'Already have an account? ' : 'New to Netflix? '}
          <button
            type="button"
            className="text-white hover:underline"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? 'Sign In Now' : 'Sign Up Now'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default login
