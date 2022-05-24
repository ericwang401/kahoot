import withProperMethod from '@middlewares/withProperMethod'
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@util/prisma'
import withAuthorized from '@middlewares/withAuthorized'

const index = async (req: NextApiRequest, res: NextApiResponse) => {
    await prisma.questions.create({
        data: {
            content: req.body.content
        }
    })

    res.status(200).end();
}

export default withProperMethod('POST', withAuthorized(index))