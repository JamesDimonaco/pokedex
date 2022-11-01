
export default interface IPokemon {
    name: string;
    order: number;
    past_types: IPokemonType[];
    sprites: IPokemonSprites;
    stats: IPokemonStats[];
    types: IPokemonType[];
    weight: number;
    height: number;
    abilities: IPokemonAbilities[];
    moves: IPokemonMoves[];
    species: IPokemonSpecies;
    forms: IPokemonForms[];
    is_default: boolean;
    location_area_encounters: string;
    game_indices: IPokemonGameIndices[];
    base_experience: number;
    id: number;

}
export interface IFormattedPokemonDetailPage {
    name: string;
    id: number;
    abilities: IPokemonAbilities[];
    types: IPokemonType[];
    order: number;
    sprites: IPokemonSprites;
    stats: IPokemonStats[];

}
export interface IFormattedPokemon {
    order: number;
    name: string;
    id: number;
    type: string;
    image: string;
    stats:IPokemonStats[];
    abilities: IPokemonAbilities;
}

export interface IPokemonEvolution {
  baby_trigger_item: string | null;
  evolution_details: [];
  evolves_to: IPokemonEvolvesTo[];
  is_baby: boolean;
  species: IPokemonSpecies;
  id: number;
}

  interface IPokemonEvolvesTo {

  }



export interface IPokemonType {
    slot: number;
    type: IPokemonTypeDetails;
}

export interface IPokemonTypeDetails {
    name: string;
    url: string;
}

export interface IPokemonSpecies {
    name: string
    url: string
  }

  export interface IPokemonAbilities {
    ability: {name: string, url: string}
    is_hidden: boolean
    slot: number
  }

  export interface IPokemonStats {
    base_stat: number
    effort: number
    stat: {name: string, url: string}
  }

  interface IPokemonGameIndices {
    game_index: number
    version: Object
  }

  export interface IPokemonForms {
    name: string
    url: string
  }

  export interface IPokemonMoves {
    move: Object
    version_group_details: Object[]
  }

  export interface IPokemonSprites {
    back_default: string | null
    back_female: string | null
    back_shiny: string | null
    back_shiny_female: string | null
    front_default: string 
    front_female: string | null
    front_shiny: string | null
    front_shiny_female: string | null
    other: {
      dream_world: Object
      home: Object
      'official-artwork': {
        front_default: string | null
      }
    }
    versions: Object
  }

  export interface Results {
    next: string;
    pokemon:{
      name: string;
      url: string;
     }

  }