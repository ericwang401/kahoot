import type { NextApiRequest, NextApiResponse } from 'next'
import withProperMethod from '@middlewares/withProperMethod'
import withAuthorized from '@middlewares/withAuthorized'

const markCorrect = (req: NextApiRequest, res: NextApiResponse) => {
    // @ts-ignore
    res.socket.server.io.sockets.emit('mark-correct-event', true)

    res.status(200).json({
        message: 'emitted mark correct event'
    })
}



export default withAuthorized(withProperMethod('POST', markCorrect))