import type { NextApiRequest, NextApiResponse } from 'next'
import withProperMethod from '@middlewares/withProperMethod'
import withAuthorized from '@middlewares/withAuthorized'

const nextQuestion = (req: NextApiRequest, res: NextApiResponse) => {
    // @ts-ignore
    res.socket.server.io.sockets.emit('next-question-event', true)

    res.status(200).json({
        message: 'emitted next question event'
    })
}



export default withAuthorized(withProperMethod('POST', nextQuestion))