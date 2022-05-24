import { withProperMethods } from '@middlewares/withProperMethod'
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@util/prisma'
import withAuthorized from '@middlewares/withAuthorized'

const destroy = {
  method: 'DELETE' as const,
  handler: async (req: NextApiRequest, res: NextApiResponse) => {
    await prisma.teams.delete({
      where: {
        id: parseInt(req.query.id as string),
      },
    })

    res.status(200).end()
  },
}

const put = {
  method: 'PUT' as const,
  handler: async (req: NextApiRequest, res: NextApiResponse) => {
    await prisma.teams.update({
      where: { id: req.body.id },
      data: {
        name: req.body.name,
      },
    })

    res.status(200).end()
  },
}

export default withAuthorized(withProperMethods([destroy, put]))
