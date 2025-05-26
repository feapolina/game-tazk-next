/**
 * Faz o fetch da api da RAWG.
 *
 * @param {string} query - O valor contido no input para realizar a busca na API com esse valor.
 * @returns {Promise<GameData[]>} - O array de jogos que batem a com a busca.
 * @example
 * const newTodo = await addTodo(1, "Complete o desafio diário");
 * console.log(newTodo);
 */

import { platform } from "os";
import { supabase } from "./lib/supabaseClient";
const API_KEY = process.env.NEXT_PUBLIC_RAWG_API_KEY;
const BASE_URL = "https://api.rawg.io/api/games";

type GameData = {
  name: string;
  image: string;
};

export async function searchGamesRAWG(query: string): Promise<GameData[]> {
  const url = `${BASE_URL}?key=${API_KEY}&search=${query}`;
  const res = await fetch(url);
  const json = await res.json();

  return json.results.map((game: any) => ({
    name: game.name,
    image: game.background_image,
  }));
}

export async function fetchGames() {
  const { data, error } = await supabase.from("selected_games").select("*");
  if (error) throw error;
  return data;
}

export async function addGameToSelected(game: { name: string; image: string }) {
  // Verifica se o jogo já existe na tabela

  const { data: existingGame } = await supabase
    .from("games")
    .select("id")
    .eq("name", game.name)
    .limit(1);

  let gameId;

  if (existingGame && existingGame.length > 0) {
    gameId = existingGame[0].id;
  } else {
    // Se não existir, cria na tabela games.
    const { data: newGame, error: gameInsertError } = await supabase
      .from("games")
      .insert([{ name: game.name, image: game.image }])
      .select()
      .single();
  }

  // Cria a relação em selected_games
  const { error } = await supabase.from("selected_games").insert([
    {
      game_id: gameId,
      user_id: null, // se não tiver login ainda, pode deixar null temporariamente
      progress: 0,
    },
  ]);

  if (error) throw error;
}

export async function removeGame(name: string) {
  const { error } = await supabase
    .from("selected_games")
    .delete()
    .eq("name", name);
  if (error) throw error;
}
