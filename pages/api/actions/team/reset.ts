import { withProperMethods } from '@middlewares/withProperMethod'
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@util/prisma'
import withAuthorized from '@middlewares/withAuthorized'

const reset = async (req: NextApiRequest, res: NextApiResponse) => {
  await prisma.teams.updateMany({
    data: {
      score: 0,
    },
  })

  res.status(200).end()
}

const post = {
  method: 'POST' as const,
  handler: reset,
}

export default withAuthorized(withProperMethods([post]))
