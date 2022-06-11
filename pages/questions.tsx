import { NextPage } from 'next';
import AppLayout from '@components/AppLayout';
import authorizeRequest from '@middlewares/authorizeRequest'
import prisma from '@util/prisma';
import CreateQuestion from '@components/CreateQuestion';
import axios from 'axios';
import { useRefreshProps } from '@util/routerUtil';
import UpdateQuestion from '@components/UpdateQuestion';

interface QuestionsProps {
  questions: {
    id: number;
    content: string;
    choices?
    : string;
    correctAnswer?: string
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
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Choices
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {questions.map((question, questionIdx) => (
                  <tr key={question.id} className={questionIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{question.content}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{question.choices}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <UpdateQuestion {...question} />
                      <button onClick={() => deleteQuestion(question.id)} className="ml-1 text-red-600 hover:text-indigo-900">
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
  let questions = await prisma.questions.findMany({
    orderBy: {
        id: 'asc'
    },
    select: {
      id: true,
      content: true,
      choices: true,
      correctAnswer: true,
    }
  })
  return {
    props: {
      questions
    }
  }
})


export default Questions