// @ts-nocheck
import type { NextApiRequest, NextApiResponse } from 'next'
import { Server } from 'socket.io'
import { isObject } from 'util'

const startSocketServer = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server)
    res.socket.server.io = io

    return io
  }

  return res.socket.server.io

}

export default startSocketServer
