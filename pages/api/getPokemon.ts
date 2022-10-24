import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.query.searchTerm) {
    const searchTerm = req.query.searchTerm;
    const pokemon = await fetch(
      "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0"
    );
    const pokemonData = await pokemon.json();
    const pokemonResults = pokemonData.results;
    const filteredPokemon = pokemonResults.filter((pokemon) =>
      pokemon.name.includes(searchTerm)
    );
    res.status(200).json(filteredPokemon);
  } else {
    const queryUrl =
      req.query.url || `https://pokeapi.co/api/v2/pokemon?limit=50&offset=0`;

    req.query.name = "pikachu";

    const pokemon = await fetch(`${queryUrl}`);

    const pokemonJson = await pokemon.json();

    const pokemonList = pokemonJson.results;

    res.status(200).json({ pokemon: pokemonList, next: pokemonJson.next });
  }
}
