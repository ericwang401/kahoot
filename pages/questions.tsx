import { NextPage } from 'next';
import AppLayout from '@components/AppLayout';
import authorizeRequest from '@middlewares/authorizeRequest'

const Questions: NextPage = () => {
    return <AppLayout>
        <></>
    </AppLayout>
}

export const getServerSideProps = authorizeRequest(async () => {
    return {
      props: {
      }
    }
  })


export default Questions