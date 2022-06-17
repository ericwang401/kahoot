import type { NextApiRequest, NextApiResponse } from 'next'

const emitNewQuestionEvent = (req: NextApiRequest, res: NextApiResponse) => {
    // @ts-ignore
    res.socket.server.io.sockets.emit('new-question-event', true)

    res.status(200).json({
        message: 'success'
    })
}

export default emitNewQuestionEvent