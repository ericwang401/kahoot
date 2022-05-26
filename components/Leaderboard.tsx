import { useEffect, useState } from 'react'
import Confetti from 'react-confetti'
import useWindowSize from 'react-use/lib/useWindowSize'

interface LeaderboardProps {
    show: boolean
    completed: boolean
    onClick: () => void
}

const Leaderboard = ({ show, onClick, completed }: LeaderboardProps) => {
    const [teams, setTeams] = useState<{ id: number; name: string; score: number }[]>([])
    const { width, height } = useWindowSize()

    useEffect(() => {
        const fetchTeams = async () => {
            const fetchedTeams = await (await fetch('/api/game/leaderboard')).json()
            const parsed = Object.values(fetchedTeams.teams) as { id: number; name: string; score: number }[]
            setTeams(parsed)
        }

        fetchTeams()
    }, [show])

    return <>
        {completed && <Confetti
            width={width}
            height={height}
        />}
        {(show || completed) && <>
            <h1 className='text-4xl mt-4 font-bold text-center'>{completed ? 'CONGRATS!!!' : 'SHEEESH DOING GOOD!1'}</h1>
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
            <div className="flex mt-4 justify-end">
                {!completed && <button
                    type="button"
                    className="w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto sm:text-sm"
                    onClick={onClick}
                >
                    Continue
                </button>}
            </div>
        </>
        }
    </>
}

export default Leaderboard