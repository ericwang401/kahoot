import { withProperMethods } from '@middlewares/withProperMethod'
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@util/prisma'
import withAuthorized from '@middlewares/withAuthorized'

const get = {
  method: 'POST' as const,
  handler: async (req: NextApiRequest, res: NextApiResponse) => {
    await prisma.questions.create({
      data: {
        content: req.body.content,
        choices: req.body.choices,
        correctAnswer: req.body.correctAnswer,
      },
    })

    res.status(200).end()
  },
}

export default withAuthorized(withProperMethods([get]))
