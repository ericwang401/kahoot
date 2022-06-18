import type { NextApiRequest, NextApiResponse } from 'next'

const emitResetQuestionEvent = (req: NextApiRequest, res: NextApiResponse) => {
    // @ts-ignore
    res.socket.server.io.sockets.emit('reset-question-event', true)

    res.status(200).json({
        message: 'success'
    })
}

export default emitResetQuestionEvent