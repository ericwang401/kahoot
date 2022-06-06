import { withProperMethods } from '@middlewares/withProperMethod'
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@util/prisma'
import withAuthorized from '@middlewares/withAuthorized'

const subtract = async (req: NextApiRequest, res: NextApiResponse) => {
  let team = await prisma.teams.findUnique({
    where: {
      id: parseInt(req.query.id as string),
    },
  })

  if (!team) {
    res.status(404).end()
    return
  }

  if (team.score === 0) {
    res.status(200).json({
      message: 'Team score is already 0',
    })
    return
  }

  await prisma.teams.update({
    where: {
      id: parseInt(req.query.id as string),
    },
    data: {
      score: team.score - 1,
    },
  })

  res.status(200).end()
}

const post = {
  method: 'POST' as const,
  handler: subtract,
}

export default withAuthorized(withProperMethods([post]))
