import { withProperMethods } from '@middlewares/withProperMethod'
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@util/prisma'

const leaderboard = async (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({
    teams: await prisma.teams.findMany({
      orderBy: [
        {
          score: 'desc',
        },
      ],
      select: {
        id: true,
        name: true,
        score: true,
      },
    }),
  })
}

const get = {
  method: 'GET' as const,
  handler: leaderboard,
}

export default withProperMethods([get])
