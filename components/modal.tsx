import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { IFormattedPokemon, IPokemonStats } from "../interfaces";
import Link from "next/link";
import Image from "next/image";
interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  pokemonFullDetails: any;
}

export default function Modal({ open, setOpen, pokemonFullDetails }: Props) {
  const [evolutionPokemon, setEvolutionPokemon] = useState<IFormattedPokemon[]>(
    []
  );

  const data = async () => {
    const res = await fetch(
      `/api/getPokemonDetails?pokemon=${pokemonFullDetails?.name}&type=evolution`
    );
    const data = await res.json();
    const sortedData = data.sort(
      (a: IFormattedPokemon, b: IFormattedPokemon) => {
        return a.order - b.order;
      }
    );
    console.log(sortedData);
    
    setEvolutionPokemon(sortedData);
  };
  useEffect(() => {
    data();
  }, [pokemonFullDetails]);

  const ModalCards = () => {
    if (evolutionPokemon.length == 0) {
      return <div>loading...</div>;
    }



    return useMemo(
      () => (
        <>
          <ul role="list" className="space-y-3">
            {evolutionPokemon.map((pokemon: IFormattedPokemon, pokemonIndex: number) => (
              <div>
                <li
                  key={pokemon.id}
                  className="overflow-hidden bg-white px-4 py-4 shadow sm:rounded-md sm:px-6"
                >
                  <Image
                    className="m-auto"
                    width={200}
                    height={200}
                    src={pokemon.image}
                    alt={pokemon.name}
                  />
                  {pokemon.name}
                  <div className="pt-3 text-gray-600">{pokemon.type}</div>
                  <div className="mt-8 flex flex-col">
                    <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                      <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                          <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-50">
                              <tr className="divide-x divide-gray-200">
                                <th
                                  scope="col"
                                  className="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                >
                                  Stats
                                </th>
                                <th
                                  scope="col"
                                  className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900"
                                >
                                  Value
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                              {pokemon.stats.map((stat: IPokemonStats) => (
                                <tr
                                  key={stat.stat.name}
                                  className="divide-x divide-gray-200"
                                >
                                  <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-6">
                                    {stat.stat.name}
                                  </td>

                                  <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-6">
                                    {stat.base_stat}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Link href={`/${pokemon.name}`}>
                    <button>View Details</button>
                  </Link>
                </li>
                {pokemonIndex === evolutionPokemon.length -1 ? null : (
                  <div className="flex justify-center items-center">
                    <svg
                      className="h-10 w-10 text-red-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </ul>
        </>
      ),
      [pokemonFullDetails, evolutionPokemon, setEvolutionPokemon]
    );
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Pokemon Evolution
                    </Dialog.Title>
                    <div className="mt-2">
                      <ModalCards />
                      {}
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    id="close-modal"
                    type="button"
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                    onClick={() => setOpen(false)}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
