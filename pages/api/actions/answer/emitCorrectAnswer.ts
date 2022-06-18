import type { NextApiRequest, NextApiResponse } from 'next'
import withProperMethod from '@middlewares/withProperMethod'

const emitCorrectAnswer = (req: NextApiRequest, res: NextApiResponse) => {
    // @ts-ignore
    res.socket.server.io.sockets.emit('correct-answer-event', {
        question: req.body.question,
        answer: req.body.answer
    })

    res.status(200).json({
        message: 'emitted correct answer'
    })
}

export default withProperMethod('POST', emitCorrectAnswer)