import Link from "next/link"
import Image from 'next/image'
import IPokemon, { IFormattedPokemonDetailPage } from "../interfaces"

export async function getStaticProps({ params }:{ params: { pokemon: string } }) {
  
  const { pokemon} = params

  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
  const data = await res.json()

  const formattedPokemon: IFormattedPokemonDetailPage = {
    id: data.id,
    name: data.name,
    abilities: data.abilities,
    types: data.types,
    order: data.order,
    sprites: data.sprites,
    stats: data.stats,
  }

  return {
    props: {
      pokemon: formattedPokemon
    }
  }
}

export async function getStaticPaths() {
  const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000')
  const data = await res.json()
  const paths = data.results.map((pokemon:any) => {
    return {
      params: { pokemon: pokemon.name }
    }
  })  
  return {
    paths,
    fallback: false
  }
}

interface Props {
  pokemon: IPokemon
}



const pokemonDetails = ({ pokemon }: Props) => {

  const order = pokemon.order.toString().padStart(3, '0')  


  return (
    <div className="flex m-10 items-center flex-col">

      <h1>{pokemon.name} detail page</h1>

      <h2 className="text-gray-500">#{order}</h2>
      <Image width={200} height={200} id={pokemon.name + '_image'} src={pokemon.sprites.other['official-artwork'].front_default} alt={pokemon.name} />

      <div className="flex space-x-5">
        <div>
          <h2 className="text-2xl">Abilities</h2>
          {pokemon.abilities.map((ability) => {
            return (
              <p key={ability.ability.name}>{ability.ability.name}</p>
            )
          })}
        </div>
        <div>
          <h2 className="text-2xl">Types</h2>
          {pokemon.types.map((type) => {
            return (
              <p key={type.type.name}>{type.type.name}</p>
            )
          })}
        </div>
      </div>

      <div className="flex flex-col items-center pt-8">
        <h2 className="text-2xl">Stats</h2>
        <table className="table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Base Stat</th>
              <th className="px-4 py-2">Effort</th>
            </tr>
          </thead>
          <tbody>
            {pokemon.stats.map((stat) => {
              return (
                <tr key={stat.stat.name}>
                  <td className="border px-4 py-2">{stat.stat.name}</td>
                  <td className="border px-4 py-2">{stat.base_stat}</td>
                  <td className="border px-4 py-2">{stat.effort}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

        <Link className="pt-10" href="/">
          <button id="back-to-home" className="text-blue-500">Back to home</button>
        </Link>


    </div>
  )
}

export default pokemonDetails