import { NextPage } from 'next';
import AppLayout from '@components/AppLayout';

const Questions: NextPage = () => {
    return <AppLayout>
        <h1>wow</h1>
    </AppLayout>
}

// @ts-ignore
Questions.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>

export default Questions