export type GameData = {
  id: number;
  rawg_id?: number; // RAWG API game ID (stored in DB); distinct from the Supabase PK `id`
  name: string;
  cover_url: string;
  status?: string;
  platform?: string;
};
