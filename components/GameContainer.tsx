import io from 'socket.io-client'
import { MutableRefObject, useEffect, useMemo, useRef, useState } from 'react'
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/solid'
import classNames from '@util/classNames'
import Leaderboard from '@components/Leaderboard'
import axios from 'axios'
import { motion, useAnimation } from 'framer-motion'

interface GameContainerProps {
    questions: {
        id: number;
        content: string;
        choices?: string;
    }[]
    teams: {
        id: number;
        name: string;
    }[]
    timeoutValue: number
}

let socket

const GameContainer = ({ questions, teams, timeoutValue }: GameContainerProps) => {
    const [showLeaderboard, setShowLeaderboard] = useState(false)

    const [connected, setConnected] = useState(false)
    const [selectedQuestion, setSelectedQuestion] = useState<number>(0)
    const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null)
    const [teamsThatBuzzed, setTeamsThatBuzzed] = useState<number[]>([])

    const [isAcceptingAnswers, setIsAcceptingAnswers] = useState(true)
    const timeoutRef = useRef<NodeJS.Timeout>()

    const [completed, setCompleted] = useState(false)
    const selectedTeam = useMemo(() => teams.find(team => team.id == selectedTeamId), [selectedTeamId, teams])
    const controls = useAnimation()

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
            setShowLeaderboard(oldCompleted => {
                if (oldCompleted) return oldCompleted;


                setIsAcceptingAnswers(isAccepting => {
                    if (!isAccepting) return isAccepting;

                    setSelectedTeamId(oldId => {
                        const check = teams.find(team => team.id == id)
                        if (!check) return oldId;
                        if (oldId) return oldId;

                        axios.post(`/api/actions/answer/${id}`, {
                            type: 'trafficLightEvent'
                        })


                        return id
                    })

                    setTeamsThatBuzzed(oldTeamsThatBuzzed => {
                        const check = teams.find(team => team.id == id)
                        if (!check) return oldTeamsThatBuzzed;

                        if (oldTeamsThatBuzzed.includes(id)) return oldTeamsThatBuzzed;

                        return [...oldTeamsThatBuzzed, id]
                    })

                    return isAccepting
                })

                return oldCompleted
            })
        })
    }

    const markAsCorrect = async () => {
        await axios.post(`/api/actions/team/add/${selectedTeamId}`)

        setShowLeaderboard(true)
        setSelectedTeamId(null)
        setTeamsThatBuzzed([])

        if (selectedQuestion + 1 < questions.length) {
            setSelectedQuestion(question => question + 1)
        } else {
            setCompleted(true)
        }
    }

    const skip = () => {
        setShowLeaderboard(true)
        setSelectedTeamId(null)
        setTeamsThatBuzzed([])

        if (selectedQuestion + 1 < questions.length) {
            setSelectedQuestion(question => question + 1)
        } else {
            setShowLeaderboard(true)
            setCompleted(true)
        }
    }

    const denyPoints = async () => {
        const deniedTeam = teamsThatBuzzed.find(teamId => teamId == selectedTeamId)
        await axios.post(`/api/actions/team/subtract/${deniedTeam}`)
        // find team that buzzed by team id and get index
        const teamIndex = teamsThatBuzzed.findIndex(teamId => teamId == selectedTeamId)
        const nextTeam = teamsThatBuzzed[teamIndex + 1]

        teamsThatBuzzed.shift()
        if (nextTeam) {
            setSelectedTeamId(nextTeam)
            return
        }
        setSelectedTeamId(null)
    }

    useEffect(() => {
        setIsAcceptingAnswers(true)

        timeoutRef.current = setTimeout(() => {
            setIsAcceptingAnswers(false)
            console.log('no longer accepting answers')
            controls.set({
                width: 0
            })
        }, timeoutValue * 1000)

        controls.set({
            width: "100%"
        })
        controls.start({
            width: 0,
            transition: {
                ease: 'linear',
                duration: timeoutValue
            }
        })

        return () => clearInterval(timeoutRef.current)
    }, [selectedQuestion, showLeaderboard])

    useEffect(() => {
        socketInitializer()
    }, [])

    return <div className='grid place-items-center h-full'>
        <div className='w-full relative'>
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
            {!showLeaderboard && <>

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
                <div className="shadow mt-5 sm:rounded-md sm:overflow-hidden bg-white">
                    <motion.div animate={controls} className='h-5 w-full bg-indigo-500'></motion.div>
                    <div className='px-4 py-5 sm:p-6'>
                        {questions.length > 0 && <>
                            <h1 className="text-7xl font-bold">{selectedQuestion + 1}. {questions[selectedQuestion].content}</h1>
                            { questions[selectedQuestion].choices && <>
                                <h3 className='text-2xl mt-3'>Choices</h3>
                                <ul className='list-disc pl-6 mt-3'>
                                    { questions[selectedQuestion].choices?.split('|').map(choice => <li className='font-bold text-4xl mt-2' key={choice}>{choice}</li>)}
                                </ul>
                            </>}
                        </>}
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
                </div>

                <div className={classNames(selectedTeamId ? 'bg-green-400' : 'bg-white', !selectedTeamId && !isAcceptingAnswers ? 'bg-red-400' : 'bg-white', 'shadow mt-5 sm:rounded-md sm:overflow-hidden px-4 py-5 sm:p-6')}>
                    {!selectedTeamId && isAcceptingAnswers && <p>Waiting for contestant to buzz in</p>}
                    {selectedTeamId && <h3 className='text-4xl font-bold'>{selectedTeam ? selectedTeam.name : ''} buzzed in</h3>}
                    {!selectedTeamId && !isAcceptingAnswers && <h3 className='text-4xl font-bold'>No one answered</h3>}
                </div>

                <div className="flex justify-end mt-4 space-x-2">
                    {selectedTeamId &&
                        <>
                            <button
                                type="button"
                                className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                                onClick={denyPoints}
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

                {!showLeaderboard && <div className='absolute w-full mt-5 grid grid-cols-3 gap-5'>
                    {teamsThatBuzzed.map((team, index) => <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className='shadow sm:rounded-md sm:overflow-hidden bg-white px-4 py-5 sm:p-6' key={team}>
                        <p>{index + 1}. {teams.find(oneTeam => oneTeam.id == team)?.name}</p>
                    </motion.div>)}
                </div>}

            </>}
        </div>
    </div>
}

export default GameContainer