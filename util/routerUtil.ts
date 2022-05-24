import { useRouter } from 'next/router'

export const useRefreshProps = () => {
    const router = useRouter()
    const refresh = () => router.replace(router.asPath)

    return { refresh }
}