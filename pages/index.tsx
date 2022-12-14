import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Card from '../components/card'
import React, {  useCallback, useState } from 'react'
import { QueryClientProvider, QueryClient } from 'react-query'
import Search from '../components/search'
import Link from 'next/link'
const Home: NextPage = () => {
  const queryClient = new QueryClient()
const [searchedData, setSearchedData] = useState(null)

  const getPokemon = async ({pageParam}:any) => {
    
    
    const res = await fetch(`/api/getPokemon?${pageParam && `url=${pageParam}&limit=50`}`)
    const data = await res.json()    
    return data
  }

  const getPokemonDetails = useCallback(async (pokemon: string) => {
    const res = await fetch(`/api/getPokemonDetails?pokemon=${pokemon}&type=full`)
    const data = await res.json()
    return data
  }, [])

  const searchForPokemon = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    
    const value:string = e.target.value
    const res = await fetch(`/api/getPokemon?searchTerm=${value}`)
    const data = await res.json()
    if (value === '') {
      setSearchedData(null)
    }else {
      setSearchedData(data)

    }
  }

  return (

      <div className="flex min-h-screen flex-col items-center justify-center py-2">
        <Head>
          <title>Pokedex</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">

          <div className="text-6xl font-bold my-5 flex flex-col">
            Pokedex

            <Link className='items-center justify-center self-center' href={'https://github.com/JamesDimonaco/pokedex'}>
            <Image  src='/githubLogo.png' alt='github-link' width={20} height={20} />
            </Link>

          </div>




          <Search clear={() => setSearchedData(null)} search={(e) => searchForPokemon(e)}/>

          <QueryClientProvider client={queryClient}>
            <Card searchedData={searchedData} getPokemon={(e) => getPokemon(e)} getPokemonDetails={(name: string) => getPokemonDetails(name)} />
          </QueryClientProvider>
        </main>
      </div>


  )
}

export default Home
