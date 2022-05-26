import StartGame from '@components/StartGame'
import type { NextPage } from 'next'
import prisma from '@util/prisma'
import { useEffect, useState } from 'react';
import GameContainer from '@components/GameContainer';
import authorizeRequest from '@middlewares/authorizeRequest';

interface PlayProps {
    questions: {
        id: number;
        content: string;
    }[]
    teams: {
        id: number;
        name: string;
    }[]
}

const Play: NextPage<PlayProps> = ({ questions, teams }) => {
    const [playing, setPlaying] = useState(false)
    const [answerTimeout, setAnswerTimeout] = useState(15)

    return <div className="max-w-7xl h-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl h-full mx-auto">
            {!playing && <StartGame timeoutValue={answerTimeout} onChange={setAnswerTimeout} onClick={() => setPlaying(true)} questions={questions} teams={teams} />}

            {playing && <GameContainer timeoutValue={answerTimeout} questions={questions} teams={teams} />}
        </div>
    </div>
}

export const getServerSideProps = authorizeRequest(async () => {
    return {
        props: {
            questions: await prisma.questions.findMany({
                select: {
                    id: true,
                    content: true
                }
            }),
            teams: await prisma.teams.findMany({
                select: {
                    id: true,
                    name: true
                }
            })
        }
    }
})

export default Play