import type { NextApiRequest, NextApiResponse } from "next";
import { IFormattedPokemon } from "../../interfaces";

export default async function detailHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const type = req.query.type;

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
    const secondEvolution =
      pokemonEvolutionJson.chain.evolves_to[0]?.species.name || null;
    const thirdEvolution =
      pokemonEvolutionJson.chain.evolves_to[0]?.evolves_to[0]?.species.name ||
      null;

    const theThree = [firstEvolution, secondEvolution, thirdEvolution];

    const evolutionNameArray = theThree.filter(
      (evolution) => evolution !== null
    );

      const pokemonPromise = new Promise((resolve, reject) => {
        let pokemonArray: IFormattedPokemon[] = [];
        evolutionNameArray.forEach(async (poke) => {
          const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${poke}`);
          const data = await res.json();
          const formattedData: IFormattedPokemon = {
            order: data.order,
            name: data.name,
            image: data.sprites?.other["official-artwork"].front_default,
            type: data.types[0].type.name,
            abilities: data.abilities.map(
              (ability: any) => ability.ability.name
            ),
            stats: data.stats,
            id: data.id,
          };
          pokemonArray.push(formattedData);
          if (pokemonArray.length === evolutionNameArray.length) {
            resolve(pokemonArray);
          }
        });
      });

      try {
        const pokemonArray = await pokemonPromise;
        res.status(200).json(pokemonArray);
      } catch (error) {
        res.status(500).json( error );
        console.log(error);
      }

  }
}
