import AppLayout from '@components/AppLayout'
import type { NextPage } from 'next'
import { useUser } from '@auth0/nextjs-auth0'
import { NextPageContext } from 'next'
import authorizeRequest from '@middlewares/authorizeRequest'

const Home: NextPage = () => {
  const { user, error, isLoading } = useUser()

  return <AppLayout>
    <h1 className='text-lg font-bold'>Nothing here</h1>
  </AppLayout>
}

export const getServerSideProps = authorizeRequest(async (ctx: NextPageContext) => {
  return {
    props: {
      wow: 'test'
    }
  }
})

export default Home
