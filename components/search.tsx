import { ChangeEvent, useState } from "react";

interface Props {
  search: (e: ChangeEvent<HTMLInputElement>) => void;
  clear: () => void;
}

export default function Search({ search, clear }: Props) {
  const [searchValue, setSearchValue] = useState('')

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      setSearchValue(e.target.value)
      search(e)
    }

    const handleClear = () => {
      setSearchValue('')
      clear()
    }

  return (
    <div>
      <div className="flex justify-center">
        <div className="mb-3 xl:w-96">
          <div className="input-group items-center flex space-x-2 w-full mb-4">
            <input
              id="pokedex_search"
              onChange={(e) => handleChange(e)}
              type="search"
              className="form-control relative flex-auto min-w-0 block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              placeholder="Search"
              aria-label="Search"
              aria-describedby="button-addon3"
              value={searchValue}
            />
            <button id="clear-search" onClick={() => handleClear()}>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
