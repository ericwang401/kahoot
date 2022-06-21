import type { NextApiRequest, NextApiResponse } from 'next'
import withProperMethod from '@middlewares/withProperMethod'
import withAuthorized from '@middlewares/withAuthorized'

const markIncorrect = (req: NextApiRequest, res: NextApiResponse) => {
    // @ts-ignore
    res.socket.server.io.sockets.emit('mark-incorrect-event', true)

    res.status(200).json({
        message: 'emitted mark incorrect event'
    })
}

export default withAuthorized(withProperMethod('POST', markIncorrect))