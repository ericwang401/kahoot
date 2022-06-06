// @ts-nocheck
import { withProperMethods } from '@middlewares/withProperMethod'
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@util/prisma'

const buzzIn = async (req: NextApiRequest, res: NextApiResponse) => {
  res.socket.server.io.sockets.emit('select-team', req.query.id)

  res.status(200).end()
}

const post = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.body.type && req.body.type === 'trafficLightEvent') {
    res.socket.server.io.sockets.emit('first-team-selected', req.query.id)
    res.status(200).json({
      message: 'First team selected and emitted',
    })
  }

  res.socket.server.io.sockets.emit('select-team', req.query.id)

  res.status(200).end()
}

const get = {
  method: 'GET' as const,
  handler: buzzIn,
}

const post = {
  method: 'POST' as const,
  handler: post,
}

export default withProperMethods([get, post])
