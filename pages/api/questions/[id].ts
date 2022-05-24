import withProperMethod from '@middlewares/withProperMethod'
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@util/prisma'
import withAuthorized from '@middlewares/withAuthorized'

const deleteQuestion = async (req: NextApiRequest, res: NextApiResponse) => {
    await prisma.questions.delete({
        where: {
            id: parseInt(req.query.id as string)
        }
    })

    res.status(200).end();
}

export default withProperMethod('DELETE', withAuthorized(deleteQuestion))