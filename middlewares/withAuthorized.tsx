import { getSession } from '@auth0/nextjs-auth0'
import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const withAuthorized = (handler: Function) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        const session = getSession(req, res)

        if (!session) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized. No session.',
            });
        }


        const user = await prisma.users.findFirst({
            where: {
                email: session.user.email
            }
        })

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized. Not registered.',
            });
        }

        return handler(req, res)
    }
}

export default withAuthorized