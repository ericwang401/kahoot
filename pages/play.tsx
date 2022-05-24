import StartGame from '@components/StartGame'
import type { NextPage } from 'next'
import prisma from '@util/prisma'
import { useEffect, useState } from 'react';
import io from 'socket.io-client'
let socket

interface PlayProps {
    questions: {
        id: number;
        content: string;
    }[]
    teams: {
        id: number;
        name: string;
        score: number;
    }[]
}

const Play: NextPage<PlayProps> = ({ questions, teams }) => {
    const [showStartGame, setShowStartGame] = useState(true)

    const socketInitializer = async () => {
        await fetch('/api/verifySocketIsRunning')
        socket = io()

        socket.on('connect', () => {
            console.log('connected')
        })

        socket.on('test', (msg: string) => {
            console.log(msg, 'e')
        })
    }

    useEffect(() => {
        console.log('wow')
        socketInitializer()
    }, [])

    return <div className="max-w-7xl h-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl h-full mx-auto">
            {showStartGame && <StartGame onClick={() => setShowStartGame(false)} questions={questions} teams={teams} />}
        </div>
    </div>
}

export const getServerSideProps = async () => {
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
                    name: true,
                    score: true
                }
            })
        }
    }
}

export default Play