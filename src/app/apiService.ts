import { GameData } from "./types";

// ─── Image URL helpers ────────────────────────────────────────────────────────

/**
 * Resizes a RAWG background_image URL to a smaller thumbnail.
 * RAWG CDN supports on-the-fly resizing via the /resize/ path segment.
 * Example: https://media.rawg.io/media/games/foo.jpg
 *       -> https://media.rawg.io/media/resize/420/-/games/foo.jpg
 */
export function optimizeCoverUrl(url: string, width = 420): string {
  if (!url) return url;
  try {
    // Handle RAWG media URLs
    if (url.includes("media.rawg.io/media/")) {
      return url.replace("/media/", `/media/resize/${width}/-/`);
    }
    // IGDB-style token swap: t_thumb → t_cover_big (264x374, plenty for cards)
    if (url.includes("t_thumb")) {
      return url.replace("t_thumb", "t_cover_big");
    }
  } catch {
    // fall through to original URL
  }
  return url;
}

/**
 * Returns a medium-quality version for use in the dialog hero banner.
 * RAWG: resize to 640px wide. IGDB: use t_cover_big.
 */
export function coverUrlForDialog(url: string): string {
  if (!url) return url;
  try {
    if (url.includes("media.rawg.io/media/")) {
      return url.replace("/media/", "/media/resize/640/-/");
    }
    if (url.includes("t_thumb")) {
      return url.replace("t_thumb", "t_cover_big"); // 264x374 IGDB
    }
    if (url.includes("t_1080p")) {
      return url.replace("t_1080p", "t_720p");
    }
  } catch {
    // fall through
  }
  return url;
}

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

/**
 * Fetches screenshots for a specific game by its RAWG ID.
 * Returns an array of image URLs suitable for use as wallpapers.
 */
export async function fetchGameScreenshots(gameId: number): Promise<string[]> {
  const url = `${BASE_URL}/${gameId}/screenshots?key=${API_KEY}&page_size=18`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const json = await res.json();
  return (json.results ?? []).map((s: any) => s.image as string);
}
