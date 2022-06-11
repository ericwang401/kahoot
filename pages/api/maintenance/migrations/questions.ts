import { withProperMethods } from '@middlewares/withProperMethod'
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@util/prisma'
import withAuthorized from '@middlewares/withAuthorized'
import seed from '@commands/seedQuestions'

export default withAuthorized(
  async (req: NextApiRequest, res: NextApiResponse) => {

    await seed()

    res.status(200).json({
        message: 'migrated questions'
    })
  }
)
