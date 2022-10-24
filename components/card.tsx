import { useCallback, useState, useRef } from 'react'

import { QueryFunction, useInfiniteQuery } from "react-query"
import { IPokemonTypeDetails } from '../interfaces'
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
    getNextPageParam: ({next}) => next
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

  if (isLoading) {
    return <div>Loading...</div>
  }
  if (isError) {
    return <div>Error</div>
  }

  const RenderSearchedPokemon = () => (
    <ul  role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {searchedData?.map((pokemon: IPokemonTypeDetails) => {

        const [open, setOpen] = useState(false)
        const [pokemonFullDetails, setPokemonFullDetails] = useState(null)

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
            <div className="flex flex-1 flex-col p-8">

              <h3 className="mt-6 text-sm font-medium text-gray-900">{pokemon.name}</h3>
              <dl className="mt-1 flex flex-grow flex-col justify-between">
                <dd className="mt-3">
                </dd>
              </dl>
            </div>
            <div>
              <div className="-mt-px flex divide-x divide-gray-200">
                <div className="flex w-0 flex-1">
                  <a
                    onClick={() => manageEvolution(pokemon.name)}
                    className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500"
                  >
                    <span className="mx-3">Evolution</span>
                  </a>
                </div>
                <div className="-ml-px flex w-0 flex-1">
                  <a href={`/${pokemon.name}`}
                    className="relative inline-flex w-0 flex-1 items-center justify-center rounded-br-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500"
                  >
                    <span className="ml-x">Details</span>
                  </a>
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
    <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

      {isSuccess && data.pages.map((page, pageIndex) =>
        page.pokemon.map((pokemon: IPokemonTypeDetails, index: number) => { 
          const [open, setOpen] = useState(false)
          const [pokemonFullDetails, setPokemonFullDetails] = useState(null)

          const manageEvolution = useCallback(async (name: string) => {
            console.log('inside ev');
            
            const pokemonDetails = await getPokemonDetails(name)
            setPokemonFullDetails(pokemonDetails)
            setOpen(true)
          }, [setPokemonFullDetails, setOpen])


          if (data.pages.length === pageIndex + 1 && page.pokemon.length === index + 1){

            return (
              <li
                ref={lastPokemonRef}
                key={pokemon.url}
                className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow"
              >
                <div className="flex flex-1 flex-col p-8">
  
                  <h3 className="mt-6 text-sm font-medium text-gray-900">{pokemon.name}</h3>
                  <dl className="mt-1 flex flex-grow flex-col justify-between">
                    <dd className="mt-3">
                    </dd>
                  </dl>
                </div>
                <div>
                  <div className="-mt-px flex divide-x divide-gray-200">
                    <div className="flex w-0 flex-1">
                      <a
                        onClick={() => manageEvolution(pokemon.name)}
                        className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500"
                      >
                        <span className="mx-3">Evolution</span>
                      </a>
                    </div>
                    <div className="-ml-px flex w-0 flex-1">
                      <a href={`/${pokemon.name}`}
                        className="relative inline-flex w-0 flex-1 items-center justify-center rounded-br-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500"
                      >
                        <span className="ml-x">Details</span>
                      </a>
                    </div>
                  </div>
                </div>
                {
                  open &&
  
                  <Modal open={open} setOpen={setOpen} pokemonFullDetails={pokemonFullDetails} />
  
                }
              </li>
            )

          } else {

            return (
              <li
  
                key={pokemon.url}
                className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow"
              >
                <div className="flex flex-1 flex-col p-8">
  
                  <h3 className="mt-6 text-sm font-medium text-gray-900">{pokemon.name}</h3>
                  <dl className="mt-1 flex flex-grow flex-col justify-between">
                    <dd className="mt-3">
                    </dd>
                  </dl>
                </div>
                <div>
                  <div className="-mt-px flex divide-x divide-gray-200">
                    <div className="flex w-0 flex-1">
                      <a
                        onClick={() => manageEvolution(pokemon.name)}
                        className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500"
                      >
                        <span className="mx-3">Evolution</span>
                      </a>
                    </div>
                    <div className="-ml-px flex w-0 flex-1">
                      <a href={`/${pokemon.name}`}
                        className="relative inline-flex w-0 flex-1 items-center justify-center rounded-br-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500"
                      >
                        <span className="ml-x">Details</span>
                      </a>
                    </div>
                  </div>
                </div>
                {
                  open &&
  
                  <Modal open={open} setOpen={setOpen} pokemonFullDetails={pokemonFullDetails} />
  
                }
              </li>
            )

          }






        }))}
      {isFetching && <div>Loading...</div>}
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