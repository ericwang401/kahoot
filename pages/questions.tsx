import { NextPage } from 'next';
import AppLayout from '@components/AppLayout';
import authorizeRequest from '@middlewares/authorizeRequest'
import prisma from '@util/prisma';
import { Prisma, Questions } from '@prisma/client';
import CreateQuestion from '@components/CreateQuestion';
import axios from 'axios';
import { useRefreshProps } from '@util/routerUtil';

interface QuestionsProps {
  questions: {
    id: number;
    content: string;
  }[];
}

const Questions: NextPage<QuestionsProps> = ({ questions }) => {
  const { refresh } = useRefreshProps()

  const deleteQuestion = (id: number) => {
    axios.delete(`/api/questions/${id}`).then(() => {
      refresh()
    })
  }

  return <AppLayout>
    <div className="flex justify-end">
      <CreateQuestion />
    </div>
    <div className="flex flex-col mt-3">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Question
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {questions.map((person, personIdx) => (
                  <tr key={person.id} className={personIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{person.content}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a href="#" className="text-indigo-600 hover:text-indigo-900">
                        Edit
                      </a>
                      <button onClick={() => deleteQuestion(person.id)} className="ml-1 text-red-600 hover:text-indigo-900">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
}

export const getServerSideProps = authorizeRequest(async () => {
  let questions: (Omit<Questions, 'createdAt' | 'updatedAt'> & { 'createdAt': Date | string, 'updatedAt': Date | string | null })[] = await prisma.questions.findMany()
  questions.map(question => {
    question.createdAt = question.createdAt.toString()

    if (!question.updatedAt) return;
    question.updatedAt = question.updatedAt?.toString()
  })
  return {
    props: {
      questions
    }
  }
})


export default Questions