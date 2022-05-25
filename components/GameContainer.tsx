import io from 'socket.io-client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/solid'
import classNames from '@util/classNames'
import Leaderboard from '@components/Leaderboard'
import axios from 'axios'

interface GameContainerProps {
    questions: {
        id: number;
        content: string;
    }[]
    teams: {
        id: number;
        name: string;
    }[]
}

let socket

const GameContainer = ({ questions, teams }: GameContainerProps) => {
    const [showLeaderboard, setShowLeaderboard] = useState(false)

    const [connected, setConnected] = useState(false)
    const [selectedQuestion, setSelectedQuestion] = useState<number>(0)
    const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null)
    const [completed, setCompleted] = useState(false)
    const selectedTeam = useMemo(() => teams.find(team => team.id == selectedTeamId), [selectedTeamId, teams])

    const socketInitializer = async () => {
        await fetch('/api/verifySocketIsRunning')
        socket = io()

        socket.on('connect', () => {
            setConnected(true)
        })

        socket.on('disconnect', () => {
            setConnected(false)
        })

        socket.on('select-team', (id: number) => {
            setSelectedTeamId(oldId => {
                if (oldId) return oldId;

                return id
            })
        })
    }

    const markAsCorrect = async () => {
        await axios.post(`/api/game/team/add/${selectedTeamId}`)

        setShowLeaderboard(true)
        setSelectedTeamId(null)

        if (selectedQuestion + 1 < questions.length) {
            setSelectedQuestion(question => question + 1)
        } else {
            setCompleted(true)
        }
    }

    const skip = () => {
        setSelectedTeamId(null)
        if (selectedQuestion + 1 < questions.length) {
            setSelectedQuestion(question => question + 1)
        } else {
            setShowLeaderboard(true)
            setCompleted(true)
        }
    }

    useEffect(() => {
        socketInitializer()
    }, [])

    return <div className='grid place-items-center h-full'>
        <div className='w-full'>
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
            <Leaderboard onClick={() => setShowLeaderboard(false)} show={showLeaderboard} completed={completed} />
            {!showLeaderboard && <>{!connected &&
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
                <div className="shadow mt-5 sm:rounded-md sm:overflow-hidden px-4 py-5 bg-white sm:p-6">
                    {questions.length > 0 && <h1 className="text-7xl font-bold">{selectedQuestion + 1}. {questions[selectedQuestion].content}</h1>}
                    {questions.length === 0 &&
                        <div className="rounded-md bg-red-50 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-red-800">There are no questions. Make sure you created some</p>
                                </div>
                            </div>
                        </div>}
                </div>

                <div className={classNames(selectedTeamId ? 'bg-green-400' : 'bg-white', 'shadow mt-5 sm:rounded-md sm:overflow-hidden px-4 py-5 sm:p-6')}>
                    {!selectedTeamId && <p>Waiting for contestant to buzz in</p>}
                    {selectedTeamId && <h3 className='text-4xl font-bold'>{selectedTeam ? selectedTeam.name : ''} buzzed in</h3>}
                </div>

                <div className="flex justify-end mt-4 space-x-2">
                    {selectedTeamId &&
                        <>
                            <button
                                type="button"
                                className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                                onClick={() => setSelectedTeamId(null)}
                            >
                                Deny points
                            </button>

                            <button
                                type="button"
                                className="w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto sm:text-sm"
                                onClick={markAsCorrect}
                            >
                                Mark as correct
                            </button>
                        </>}
                    <div className="grow"></div>

                    <button
                        type="button"
                        className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                        onClick={skip}
                    >
                        Skip
                    </button>
                </div>

            </>}
        </div>
    </div>
}

export default GameContainer