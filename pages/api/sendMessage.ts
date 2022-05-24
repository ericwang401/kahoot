// @ts-nocheck
import type { NextApiRequest, NextApiResponse } from 'next'
import { Server } from 'socket.io'

const sendMessage = async (req: NextApiRequest, res: NextApiResponse) => {
    res.socket.server.io.sockets.emit('test', 'deez')

    res.status(200).end()
}

export default sendMessage