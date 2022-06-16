// @ts-nocheck
import { withProperMethods } from '@middlewares/withProperMethod'
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@util/prisma'
import withAuthorized from '@middlewares/withAuthorized'
import startSocketServer from '@util/startSocketServer'

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

  const socket = await startSocketServer(req, res)

  if (req.body.modifier) {
    const modifier = parseInt(req.body.modifier as string)
    await prisma.teams.update({
      where: {
        id: parseInt(req.query.id as string),
      },
      data: {
        score: team.score + modifier,
      },
    })

    socket.sockets.emit('score-change-event', {
      id: team.id,
      score: team.score + modifier,
    })

  } else {
    await prisma.teams.update({
      where: {
        id: parseInt(req.query.id as string),
      },
      data: {
        score: team.score + 2,
      },
    })

    socket.sockets.emit('score-change-event', {
      id: team.id,
      score: team.score + 2,
    })
  }

  res.status(200).json({
    message: `modified by +${req.body.modifier || 2}`,
  })
}

const post = {
  method: 'POST' as const,
  handler: add,
}

export default withAuthorized(withProperMethods([post]))
