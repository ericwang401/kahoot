// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import withAuthorized from '@middlewares/withAuthorized'
import type { NextApiRequest, NextApiResponse } from 'next'
const { PrismaClient } = require('@prisma/client')

type Data = {
  name: string
}

const handler = (req: NextApiRequest, res: NextApiResponse<Data>) => {
  res.status(200).json({ name: 'John Doe' })
}

export default withAuthorized(handler)