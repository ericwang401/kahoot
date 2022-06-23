import io from 'socket.io-client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/solid'
import classNames from '@util/classNames'
import Leaderboard from '@components/Leaderboard'
import axios from 'axios'
import { motion, useAnimation } from 'framer-motion'
import play from '@util/playSound'

interface GameContainerProps {
    questions: {
        id: number;
        content: string;
        choices?: string;
        correctAnswer?: string;
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
    const showLeaderboardRef = useRef(showLeaderboard)
    const [showAnswer, setShowAnswer] = useState(false)

    const [connected, setConnected] = useState(false)
    const [selectedQuestion, setSelectedQuestion] = useState<number>(0)
    const selectedQuestionRef = useRef(selectedQuestion)
    const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null)
    const selectedTeamIdRef = useRef(selectedTeamId)
    const [teamsThatBuzzed, setTeamsThatBuzzed] = useState<number[]>([])
    const teamsThatBuzzedRef = useRef(teamsThatBuzzed)
    const [teamsThatAnswered, setTeamsThatAnswered] = useState<number[]>([])

    const [isAcceptingAnswers, setIsAcceptingAnswers] = useState(true)
    const timeoutRef = useRef<NodeJS.Timeout>()

    const [completed, setCompleted] = useState(false)
    const selectedTeam = useMemo(() => teams.find(team => team.id == selectedTeamId), [selectedTeamId, teams])
    const controls = useAnimation()

    useEffect(() => {
        showLeaderboardRef.current = showLeaderboard
        selectedQuestionRef.current = selectedQuestion
        teamsThatBuzzedRef.current = teamsThatBuzzed
        selectedTeamIdRef.current = selectedTeamId
    }, [showLeaderboard, selectedQuestion, teamsThatBuzzed, selectedTeamId])

    const getVoices = (): Promise<SpeechSynthesisVoice[]> => {
        return new Promise(
            function (resolve, reject) {
                let synth = window.speechSynthesis;
                let id: NodeJS.Timer;

                id = setInterval(() => {
                    if (synth.getVoices().length !== 0) {
                        resolve(synth.getVoices());
                        clearInterval(id);
                    }
                }, 10);
            }
        )
    }

    const correctSoundEffects = [
        'https://www.myinstants.com/media/sounds/winner-bell-game-show-sound-effect.mp3',
        // 'https://cdn.discordapp.com/attachments/727562307798040628/792948342127853578/trumpet_albert.mp3',

    ]

    const incorrectSoundEffects = [/*
        'https://www.myinstants.com/media/sounds/bruh.mp3',
        'https://www.myinstants.com/media/sounds/oof_withreverb.mp3', */
        'https://www.myinstants.com/media/sounds/the-beginning-of-sicko-mode-sound-effect-for-memes_xAcUeuI.mp3'
    ]

    const speechSynthesisUtterance = useMemo(async () => {
        const speech = new SpeechSynthesisUtterance()
        const voices = await getVoices()
        console.log({ voices })
        speech.voice = voices.find(voice => voice.lang === 'en-GB') as SpeechSynthesisVoice
        speech.rate = 0.7
        return speech
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

        socket.on('mark-incorrect-event', () => {
            denyPoints()
        })

        socket.on('mark-correct-event', () => {
            markAsCorrect()
        })

        socket.on('next-question-event', () => {
            console.log('triggered next question', showLeaderboardRef.current)
            if (showLeaderboardRef.current) {
                nextQuestion()
            } else {
                skip()
            }
        })

        socket.on('select-team', (id: number) => {
            setShowLeaderboard(oldCompleted => {
                if (oldCompleted) return oldCompleted;


                setIsAcceptingAnswers(isAccepting => {
                    if (!isAccepting) return isAccepting;

                    setTeamsThatAnswered(oldTeamsThatAnswered => {
                        if (oldTeamsThatAnswered.includes(id)) return oldTeamsThatAnswered;

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

                        return oldTeamsThatAnswered
                    })

                    return isAccepting
                })

                return oldCompleted
            })
        })
    }

    const nextQuestion = () => {
        setShowLeaderboard(false)
        axios.post('/api/actions/question/emitNewQuestionEvent')
        play('https://www.myinstants.com/media/sounds/26f8b9_sonic_ring_sound_effect.mp3')
    }

    const markAsCorrect = async () => {
        await axios.post(`/api/actions/team/add/${selectedTeamIdRef.current}`)

        /*  const speech = await speechSynthesisUtterance
         speech.text = `good job ${selectedTeam?.name}`
         window.speechSynthesis.speak(speech) */
        // get random element from correctSoundEffects
        const soundEffect = correctSoundEffects[Math.floor(Math.random() * correctSoundEffects.length)]
        play(soundEffect)
        setShowAnswer(true)

        /* setTeamsThatAnswered([])
        setShowLeaderboard(true)
        setSelectedTeamId(null)
        setTeamsThatBuzzed([])
        setShowAnswer(false)

        if (selectedQuestion + 1 < questions.length) {
            setSelectedQuestion(question => question + 1)
        } else {
            setCompleted(true)
        } */
    }

    const skip = () => {
        setTeamsThatAnswered([])
        setShowLeaderboard(true)
        setSelectedTeamId(null)
        setShowAnswer(false)
        setTeamsThatBuzzed([])
        console.log(selectedQuestionRef.current, 'selectedQuestion')
        if (selectedQuestionRef.current + 1 < questions.length) {
            setSelectedQuestion(question => question + 1)
        } else {
            setShowLeaderboard(true)
            setCompleted(true)
        }
    }

    const denyPoints = async () => {
        console.log(teamsThatBuzzedRef.current, 'teamsthatbuzzed')
        const deniedTeam = teamsThatBuzzedRef.current.find(teamId => teamId == selectedTeamIdRef.current) as number
        await axios.post(`/api/actions/team/subtract/${deniedTeam}`,  {
            modifier: 2
        })

        setTeamsThatAnswered(oldTeamsThatAnswered => {
            //console.log({oldTeamsThatAnswered})
            if (oldTeamsThatAnswered.includes(deniedTeam)) return oldTeamsThatAnswered;

            return [...oldTeamsThatAnswered, deniedTeam]
        })

        const soundEffect = incorrectSoundEffects[Math.floor(Math.random() * incorrectSoundEffects.length)]
        play(soundEffect)

        // find team that buzzed by team id and get index
        const teamIndex = teamsThatBuzzedRef.current.findIndex(teamId => teamId == selectedTeamIdRef.current)
        const nextTeam = teamsThatBuzzedRef.current[teamIndex + 1]
        //console.log({nextTeam})

        setTeamsThatBuzzed(oldTeamsThatBuzzed => {
            let newArray = [...oldTeamsThatBuzzed]
            newArray.shift()
            return newArray
        }
        )

        if (nextTeam) {
            setSelectedTeamId(nextTeam)
            return
        }
        setSelectedTeamId(null)
    }

    useEffect(() => {
        if (showLeaderboard) return;

        setIsAcceptingAnswers(true)
        console.log(questions, selectedQuestion)
        axios.post('/api/actions/answer/emitCorrectAnswer', {
            question: questions[selectedQuestion].content,
            answer: questions[selectedQuestion].correctAnswer
        })

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

    return <>
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
        <div className='flex justify-center relative'>
            <div className='grid relative place-items-center h-full w-full'>
                <div className='w-full relative'>
                    <Leaderboard onClick={nextQuestion} show={showLeaderboard} completed={completed} />
                    {!showLeaderboard && <>


                        <div className="shadow mt-5 sm:rounded-md sm:overflow-hidden bg-white">
                            <motion.div animate={controls} className='h-5 w-full bg-indigo-500'></motion.div>
                            <div className='px-4 py-5 sm:p-6'>
                                {questions.length > 0 && <>
                                    <h1 className={classNames(questions[selectedQuestion].content.length > 40 ? 'text-4xl' : 'text-7xl', 'font-bold')}>{selectedQuestion + 1}. {questions[selectedQuestion].content}</h1>
                                    {questions[selectedQuestion].choices && <>
                                        <h3 className='text-2xl mt-3'>Choices</h3>
                                        <ul className='list-disc pl-6 mt-3'>
                                            {questions[selectedQuestion].choices?.split('|').map(choice => <li className='font-bold text-4xl mt-2' key={choice}>{choice}</li>)}
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
                            {!selectedTeamId && !isAcceptingAnswers && <h3 className='text-4xl font-bold'>Time ran out</h3>}
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
                                        Mark Correct
                                    </button>
                                </>}
                            <div className="grow"></div>

                            {/*  <button
                                type="button"
                                className="w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto sm:text-sm"
                                onClick={() => setShowAnswer(val => !val)}
                            >
                                Toggle Answer
                            </button> */}
                            <button
                                type="button"
                                className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                                onClick={skip}
                            >
                                Continue
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
            <div>

                {(!selectedTeamId && !completed && !isAcceptingAnswers || showAnswer) && <div className='ml-5 mt-5 min-w-[30rem] absolute shadow sm:rounded-md sm:overflow-hidden bg-white px-4 py-5 sm:p-6'>
                    <h3 className='text-4xl font-bold'>Correct Answer</h3>
                    <p className='text-2xl'>{questions[selectedQuestion].correctAnswer ? questions[selectedQuestion].correctAnswer : 'No correct answers'}</p>


                </div>}
            </div>
        </div></>
}

export default GameContainer