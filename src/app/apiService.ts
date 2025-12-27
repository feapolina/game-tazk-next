import { GameData } from "./types";

/**
 * Faz o fetch da api da RAWG.
 *
 * @param {string} query - O valor contido no input para realizar a busca na API com esse valor.
 * @returns {Promise<GameData[]>} - O array de jogos que batem a com a busca.
 * @example
 * const newTodo = await addTodo(1, "Complete o desafio diário");
 * console.log(newTodo);
 */

const API_KEY = process.env.NEXT_PUBLIC_RAWG_API_KEY;
const BASE_URL = "https://api.rawg.io/api/games";

export async function searchGamesRAWG(query: string): Promise<GameData[]> {
  const url = `${BASE_URL}?key=${API_KEY}&search=${query}`;
  const res = await fetch(url);
  const json = await res.json();

  return json.results.map((game: any) => ({
    id: game.id,
    name: game.name,
    cover_url: game.background_image,
  }));
}
