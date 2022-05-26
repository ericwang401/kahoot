// @ts-nocheck
import type { NextApiRequest, NextApiResponse } from 'next'
import { Server } from 'socket.io'

const verifySocketIsRunning = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (res.socket.server.io) {
    res.status(200).json({
      message: 'Socket is running',
      isSocketRunning: true,
    })
  } else {
    const io = new Server(res.socket.server)
    res.socket.server.io = io

    res.status(200).json({
      message: 'Socket is starting up',
      isSocketRunning: false,
    })
  }

  res.status(200).end()
}

export default verifySocketIsRunning
