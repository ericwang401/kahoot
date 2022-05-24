import { NextApiRequest, NextApiResponse } from 'next'

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'

const withProperMethod = (allowedMethod: Method, handler: Function) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        const { method } = req

        if (method !== allowedMethod) {
            return res.status(405).json({
                success: false,
                message: `Method ${method} not allowed. Only ${allowedMethod} is allowed.`,
            })
        }

        return handler(req, res)
    }
}

export default withProperMethod