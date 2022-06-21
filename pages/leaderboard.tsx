import { NextPageContext } from 'next'
import authorizeRequest from '@middlewares/authorizeRequest'
import io from 'socket.io-client'
import { useEffect, useState } from 'react'
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/solid'

let socket

interface CorrectAnswerEvent {
    question: string
    answer: string
}

const Leaderboard = () => {
    const [connected, setConnected] = useState(false)
    const [payload, setPayload] = useState<CorrectAnswerEvent>()
    const [teams, setTeams] = useState<{ id: number; name: string; score: number }[]>([])

    const fetchTeams = async () => {
        const fetchedTeams = await (await fetch('/api/teams/leaderboard')).json()
        const parsed = Object.values(fetchedTeams.teams) as { id: number; name: string; score: number }[]
        setTeams(parsed)
    }

    useEffect(() => {
        fetchTeams()
    }, [])

    const socketInitializer = async () => {
        await fetch('/api/verifySocketIsRunning')
        socket = io()

        socket.on('connect', () => {
            setConnected(true)
        })

        socket.on('disconnect', () => {
            setConnected(false)
        })

        socket.on('score-change-event', () => {
            fetchTeams()
        })
    }

    useEffect(() => {
        socketInitializer()
    }, [])

    return  <div className="max-w-3xl h-full mx-auto">

        {!connected &&
            <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium text-red-800">Disconnected from server</p>
                    </div>
                </div>
            </div>
        }

        {connected &&
            <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium text-green-800">Connected to server</p>
                    </div>
                </div>
            </div>
        }
        <div className="bg-white border mt-4 border-gray-300 overflow-hidden rounded-md">
            <ul role="list" className="divide-y divide-gray-300">
                {teams && teams.map((team, index) => (
                    <li key={team.id} className="px-6 py-4">
                        <div className="flex justify-between">
                            <p className='text-xl'>{index + 1}. <span className='font-bold'>{team.name}</span></p> <p>{team.score}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    </div>
}

export const getServerSideProps = authorizeRequest(async (ctx: NextPageContext) => {
    return { props: {} }
})


export default Leaderboard