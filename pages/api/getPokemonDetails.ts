import type { NextApiRequest, NextApiResponse } from "next";
import { IFormattedPokemon } from "../../interfaces";

export default async function detailHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const type = req.query.type;
  let test:any[] = [];

  const pokemonDetails = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${req.query.pokemon}`
  );
  const pokemonDetailsJson = await pokemonDetails.json();

  const pokemonSpecies = await fetch(pokemonDetailsJson.species.url);
  const pokemonSpeciesJson = await pokemonSpecies.json();

  const pokemonEvolution = await fetch(pokemonSpeciesJson.evolution_chain.url);
  const pokemonEvolutionJson = await pokemonEvolution.json();




  if (type === "main") {
    res.status(200).json(pokemonDetailsJson);
  } else if (type === "full") {
    const pokemonSpecies = await fetch(pokemonDetailsJson.species.url);
    const pokemonSpeciesJson = await pokemonSpecies.json();

    const pokemonEvolution = await fetch(
      pokemonSpeciesJson.evolution_chain.url
    );
    const pokemonEvolutionJson = await pokemonEvolution.json();



    const pokemonFullDetails = {
      ...pokemonDetailsJson,
      species: pokemonSpeciesJson,
      evolution: pokemonEvolutionJson,
    };
    
    res.status(200).json(pokemonFullDetails);



  } else if (type === "evolution") {


    const firstEvolution = pokemonEvolutionJson.chain.species.name || null;
    const secondEvolution = pokemonEvolutionJson.chain.evolves_to[0]?.species.name || null;
    const thirdEvolution = pokemonEvolutionJson.chain.evolves_to[0]?.evolves_to[0]?.species.name || null;

    const theThree = [firstEvolution, secondEvolution, thirdEvolution];

    const evolutionNameArray = theThree.filter((evolution) => evolution !== null);

    const formatPokemonDetails = async (pokemon: string[]) => {    
      const pokemonPromise = new Promise((resolve, reject) => {
        let pokemonArray: IFormattedPokemon[] = [];
        pokemon.forEach(async poke => {
          const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${poke}`);
          const data = await res.json();


          
          const formattedData: IFormattedPokemon = {
            name: data.name,
            image: data.sprites?.other["official-artwork"].front_default,
            type: data.types[0].type.name,
            abilities: data.abilities.map((ability: any) => ability.ability.name),
            stats: data.stats,
            id: data.id,
          };
          pokemonArray.push(formattedData)     
          
          if (pokemonArray.length === pokemon.length) {
            resolve(pokemonArray);
          }
        });
      });
  
      pokemonPromise.then((data) => {        
        res.status(200).json(data);    })
    };

      
    formatPokemonDetails(evolutionNameArray);

  }
}
