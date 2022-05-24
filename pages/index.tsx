import AppLayout from '@components/AppLayout'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useUser } from '@auth0/nextjs-auth0'
import { NextPageContext } from 'next'
import withAuthorized from '@middlewares/withAuthorized'
import authorizeRequest from '@middlewares/authorizeRequest'
import { ReactNode } from 'react'

const Home: NextPage = () => {
  const { user, error, isLoading } = useUser()

  return <AppLayout>
    <h1 className='text-lg font-bold'>test</h1>
  </AppLayout>
}

// @ts-ignore
Home.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>

export const getServerSideProps = authorizeRequest(async (ctx: NextPageContext) => {
  return {
    props: {
      wow: 'test'
    }
  }
})

export default Home
