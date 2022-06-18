import AppLayout from '@components/AppLayout'
import type { NextPage } from 'next'
import { NextPageContext } from 'next'
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import authorizeRequest from '@middlewares/authorizeRequest'
import Field from '@components/Field';
import axios from 'axios';

const LinkSchema = Yup.object().shape({
  link: Yup.string().url('Invalid URL').required('Required'),
})

interface Values {
  link: string
}

const Home: NextPage = () => {
  const onSubmit = async (values: Values) => {
    await axios.post('/api/maintenance/seeders/questions', {
      link: values.link,
    })

    alert('updated questions')
  }

  return <AppLayout>
    <h1 className='text-lg font-bold'>Update questions via link</h1>
    <Formik validationSchema={LinkSchema} initialValues={{
      link: ''
    }} onSubmit={onSubmit}>
      {() => (<Form>

        <Field type="text" name="link" label="Link" />
        <button
          type="submit"
          className="w-full mt-4 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto sm:text-sm"
        >
          Update
        </button>
      </Form>)}
    </Formik>
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
