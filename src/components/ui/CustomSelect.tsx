import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  error?: string;
  className?: string;
  disabled?: boolean;
}

export default function CustomSelect({ label, value, onChange, options, error, className = '', disabled = false }: CustomSelectProps) {
  const selectedOption = options.find(option => option.value === value);

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <Listbox value={value} onChange={onChange} disabled={disabled}>
        <div className="relative">
          <Listbox.Button className={`
            relative w-full cursor-default rounded-lg py-2 pl-3 pr-10 text-left
            bg-white dark:bg-gray-700
            border border-gray-300 dark:border-gray-600
            text-gray-900 dark:text-white
            focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
            focus:border-blue-500 dark:focus:border-blue-400
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors
          `}>
            <span className="block truncate">
              {selectedOption?.label || 'Select an option'}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white dark:bg-gray-700 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {options.map((option) => (
                <Listbox.Option
                  key={option.value}
                  className={({ active, selected }) =>
                    `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                      active 
                        ? 'bg-blue-50 dark:bg-gray-600 text-blue-900 dark:text-white' 
                        : 'text-gray-900 dark:text-white'
                    }`
                  }
                  value={option.value}
                >
                  {({ selected }) => (
                    <>
                      <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                        {option.label}
                      </span>
                      {selected && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                          <CheckIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                        </span>
                      )}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
} 