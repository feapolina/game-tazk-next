/**
 * Faz o fetch da api da RAWG.
 *
 * @param {string} query - O valor contido no input para realizar a busca na API com esse valor.
 * @returns {Promise<GameData[]>} - O array de jogos que batem a com a busca.
 * @example
 * const newTodo = await addTodo(1, "Complete o desafio diário");
 * console.log(newTodo);
 */

const API_KEY = process.env.NEXT_ENV_RAWG_API_KEY;
const BASE_URL = "https://api.rawg.io/api/games";

type GameData = {
  name: string;
  image: string;
};

export async function fetchGames(query: string): Promise<GameData[]> {
  try {
    const response = await fetch(
      `${BASE_URL}?search=${encodeURIComponent(query)}&key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error("Erro na requisição à API");
    }

    const data = await response.json();

    return data.results.map((game: any) => ({
      name: game.name,
      image: game.background_image || "",
    }));
  } catch (error) {
    console.error("Erro ao buscar jogos:", error);
    return [];
  }
}
