import { withProperMethods } from '@middlewares/withProperMethod'
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@util/prisma'

const get = {
  method: 'GET' as const,
  handler: async (req: NextApiRequest, res: NextApiResponse) => {
    await prisma.teams.findUnique({
      where: {
        id: parseInt(req.query.id as string),
      }
    })
  }
}

export default withProperMethods([get])
