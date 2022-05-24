// @ts-nocheck
import { withProperMethods } from '@middlewares/withProperMethod'
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@util/prisma'

const buzzIn = async (req: NextApiRequest, res: NextApiResponse) => {
  res.socket.server.io.sockets.emit('select-team', req.query.id)

  res.status(200).end()
}

const get = {
  method: 'GET' as const,
  handler: buzzIn,
}

const post = {
  method: 'POST' as const,
  handler: buzzIn,
}

export default withProperMethods([get, post])
