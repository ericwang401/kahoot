import type { NextApiRequest, NextApiResponse } from 'next'

const emitGroupChangeEvent = (req: NextApiRequest, res: NextApiResponse) => {
    // @ts-ignore
    res.socket.server.io.sockets.emit('group-change-event', true)

    res.status(200).json({
        message: 'success'
    })
}

export default emitGroupChangeEvent
