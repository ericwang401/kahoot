import { ExclamationCircleIcon } from '@heroicons/react/solid'
import classNames from '@util/classNames'

interface InputProps extends Omit<JSX.IntrinsicElements['input'], 'ref'> {
  label: string
  errors?: string
}

export default function Input({ label, errors, ...props }: InputProps) {
  return (
    <div>
      <label htmlFor={label} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1 relative rounded-md shadow-sm">
        <input
          id={label}
          className={classNames(errors ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500" : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500', "block w-full pr-10 focus:outline-none sm:text-sm rounded-md")}
          {...props}
        />

        {errors && <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
        </div>}
      </div>
      {errors && <p className="mt-2 text-sm text-red-600">
        {errors}
      </p>}
    </div>
  )
}