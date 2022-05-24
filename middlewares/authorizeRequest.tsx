import { NextPageContext } from 'next'
import { getSession } from '@auth0/nextjs-auth0'
import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

const authorizeRequest = (handler: Function) => {
    return async ({ req, res }: { req: NextApiRequest, res: NextApiResponse}) => {
        const session = getSession(req, res)

        if (!session) {
            return {
                redirect: {
                  destination: '/api/auth/login',
                  permanent: false,
                },
            }
        }

        const user = await prisma.users.findFirst({
            where: {
                email: session.user.email
            }
        })

        if (!user) {
            return {
                redirect: {
                  destination: '/api/auth/login',
                  permanent: false,
                },
            }
        }

        return handler({ req, res })
    }
}

export default authorizeRequest