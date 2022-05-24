import AppLayout from '@components/AppLayout'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useUser } from '@auth0/nextjs-auth0'

const Home: NextPage = () => {
  const { user, error, isLoading } = useUser()
  console.log(user)

  return <AppLayout>
    <h1 className='text-lg font-bold'>test</h1>
  </AppLayout>
}

export default Home
