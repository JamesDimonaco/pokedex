import Link from 'next/link'
import { useCallback, useState, useRef } from 'react'

import { QueryFunction, useInfiniteQuery } from "react-query"
import { IFormattedPokemon, IPokemonTypeDetails } from '../interfaces'
import Modal from './modal'

interface Props {
  searchedData: IPokemonTypeDetails[] | null
  getPokemon: QueryFunction<{
    pokemon: any, next: string;
  }, "pokemon">
  getPokemonDetails: (pokemon: string) => Promise<any>
}
//! This Page is quite messy and with more time I would make this a dumb component and move the logic to a separate file
const Card = ({ searchedData, getPokemon, getPokemonDetails }: Props) => {

  const { data, isLoading, isError, isSuccess, fetchNextPage, isFetching, hasNextPage } = useInfiniteQuery('pokemon', getPokemon, {
    getNextPageParam: ({ next }) => next
  })


  const observer = useRef<IntersectionObserver>()
  const lastPokemonRef = useCallback((node: any) => {
    if (isFetching) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage()
      }
    })
    if (node) observer.current.observe(node)
  }, [isLoading, isFetching, hasNextPage])

  const Loader = () => (

    <div role="status">
      <svg aria-hidden="true" className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>

  )

  if (isLoading) {
    return <Loader />
  }
  if (isError) {
    return <div>Error</div>
  }

  const RenderSearchedPokemon = () => (
    <ul role="list" className="grid  gap-6 grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {searchedData?.map((pokemon: IPokemonTypeDetails) => {
        const pokemonName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
        const [open, setOpen] = useState(false)
        const [pokemonFullDetails, setPokemonFullDetails] = useState(null)
        const pokemonId = pokemon.url.slice(34, -1).toString().padStart(3, '0')

        const manageEvolution = useCallback(async (name: string) => {
          const pokemonDetails = await getPokemonDetails(name)
          setPokemonFullDetails(pokemonDetails)
          setOpen(true)
        }, [setPokemonFullDetails, setOpen])
        return (
          <li
            
            key={pokemon.url}
            className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow"
          >
            <h4 className="text-sm text-blue-800 ">{pokemonId}</h4>

            <div id={pokemon.name} className="flex flex-1 flex-col p-8">

              <h3 className="mt-6 text-sm font-medium text-gray-900">{pokemonName}</h3>
              <dl className="mt-1 flex flex-grow flex-col justify-between">
                <dd className="mt-3">
                </dd>
              </dl>
            </div>
            <div>
              <div className="-mt-px flex divide-x divide-gray-200">
                <div className="flex w-0 flex-1">
                  <button
                    id={pokemon.name + '_evolution'}
                    onClick={() => manageEvolution(pokemon.name)}
                    className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500"
                  >
                    <span className="mx-3">Evolution</span>
                  </button>
                </div>
                <div className="-ml-px flex w-0 flex-1">
                  <Link id={pokemon.name + '_details'} href={`/${pokemon.name}`}
                    className="relative inline-flex w-0 flex-1 items-center justify-center rounded-br-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500"
                  >
                    <span className="ml-x">Details</span>
                  </Link>
                </div>
              </div>
            </div>
            {
              open &&

              <Modal open={open} setOpen={setOpen} pokemonFullDetails={pokemonFullDetails} />

            }
          </li>
        )
      })}
      {isFetching && <div>Loading...</div>}
    </ul>
  )


  const RenderMappedPokemon = () => (
    <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">

      {isSuccess && data.pages.map((page, pageIndex) =>
        page.pokemon.map((pokemon: IPokemonTypeDetails, index: number) => {
          const [open, setOpen] = useState(false)
          const [pokemonFullDetails, setPokemonFullDetails] = useState(null)
          const pokemonName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
          const pokemonId = pokemon.url.slice(34, -1).toString().padStart(3, '0')

          const manageEvolution = useCallback(async (name: string) => {

            const pokemonDetails = await getPokemonDetails(name)
            setPokemonFullDetails(pokemonDetails)
            setOpen(true)
          }, [setPokemonFullDetails, setOpen])

          return (
            <li
              ref={data.pages.length === pageIndex + 1 && page.pokemon.length === index + 1 ? lastPokemonRef : null}
              key={pokemon.url}
              className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow"
            >
              <h4 className="text-sm text-blue-800 ">{pokemonId}</h4>

              <div id={pokemon.name}
                className="flex flex-1 flex-col p-8">

                <h3 className="mt-6 text-sm font-medium text-gray-900">{pokemonName}</h3>
                <dl className="mt-1 flex flex-grow flex-col justify-between">
                  <dd className="mt-3">
                  </dd>
                </dl>
              </div>
              <div>
                <div className="-mt-px flex divide-x divide-gray-200">
                  <div className="flex w-0 flex-1">
                    <button
                      id={pokemon.name + '_evolution'}
                      onClick={() => manageEvolution(pokemon.name)}
                      className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500"
                    >
                      <span className="mx-3">Evolution</span>
                    </button>
                  </div>
                  <div className="-ml-px flex w-0 flex-1">
                    <Link id={pokemon.name + '_details'} href={`/${pokemon.name}`}
                      className="relative inline-flex w-0 flex-1 items-center justify-center rounded-br-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500"
                    >
                      <span className="ml-x">Details</span>
                    </Link>
                  </div>
                </div>
              </div>
              {
                open &&

                <Modal open={open} setOpen={setOpen} pokemonFullDetails={pokemonFullDetails} />

              }
            </li>
          )

        }))}
      {isFetching && <Loader />}
    </ul>


  )

  return (
    <div>{
      searchedData ? <RenderSearchedPokemon /> : <RenderMappedPokemon />
    }
    </div>
  )
}

export default Card