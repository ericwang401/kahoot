// @ts-nocheck
import { withProperMethods } from '@middlewares/withProperMethod'
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@util/prisma'
import withAuthorized from '@middlewares/withAuthorized'

const add = async (req: NextApiRequest, res: NextApiResponse) => {
  let team = await prisma.teams.findUnique({
    where: {
      id: parseInt(req.query.id as string),
    },
  })

  if (!team) {
    res.status(404).end()
    return
  }

  await prisma.teams.update({
    where: {
      id: parseInt(req.query.id as string),
    },
    data: {
      score: team.score + 2,
    },
  })

  res.socket.server.io.sockets.emit('score-change-event', {
    id: team.id,
    score: team.score + 2,
  })

  res.status(200).end()
}

const post = {
  method: 'POST' as const,
  handler: add,
}

export default withAuthorized(withProperMethods([post]))
