import { GetServerSidePropsContext } from 'next'
import { getSession } from '@auth0/nextjs-auth0'
import prisma from '@util/prisma'

const authorizeRequest = (handler: Function) => {
    return async ({ req, res }: GetServerSidePropsContext) => {
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