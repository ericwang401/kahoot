import { Fragment, useEffect, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { PlusCircleIcon } from '@heroicons/react/outline'
import { Formik, Form } from 'formik';
import Field from '@components/Field';
import * as Yup from 'yup';
import axios from 'axios'
import { useRefreshProps } from '@util/routerUtil';

interface Props {
    id: number
    name: string
}

const JudgePanel = ({ id, name }: Props) => {
    const [open, setOpen] = useState(false)
    const [score, setScore] = useState(0)
    const { refresh } = useRefreshProps()

    const cancelButtonRef = useRef(null)

    useEffect(() => {
        axios.get(`/api/teams/meta/${id}`)
            .then(res => setScore(res.data.team.score as number))
    }, [])

    const addScore = async () => {
        await axios.post(`/api/actions/team/add/${id}`, {
            modifier: 1
        })

        setScore(score => score + 1)
    }

    const subtractScore = async () => {
        await axios.post(`/api/actions/team/subtract/${id}`)

        setScore(score => score - 1)
    }

    return <>

        <button
            type="button"
            className="text-indigo-600 hover:text-indigo-900"
            onClick={() => setOpen(true)}
        >
            Judge
        </button>
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full">
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                                            <PlusCircleIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                                        </div>
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                            <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                                Judging Team {name}
                                            </Dialog.Title>
                                            <div className="mt-2">
                                                <h3 className='text-2xl font-medium'>Score: {score}</h3>
                                                <div className="flex space-x-2">
                                                    <button
                                                        type="button"
                                                        className="w-full justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto sm:text-sm"
                                                        onClick={addScore}
                                                    >
                                                        Add
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                                                        onClick={subtractScore}
                                                    >
                                                        Subtract
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="button"
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                        onClick={() => setOpen(false)}
                                        ref={cancelButtonRef}
                                    >
                                        Close
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    </>
}

export default JudgePanel