"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Gamepad2,
  Trophy,
  Heart,
  Layers,
  User,
  Calendar,
  ChevronRight,
  Home,
  Gem,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/app/components/custom_components/Navbar";
import { fetchUserGames, fetchUserProfile } from "@/app/gameService";
import { GameData } from "@/app/types";
import { optimizeCoverUrl } from "@/app/apiService";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const GRADIENTS = [
  ["#ef4444", "#f97316", "#eab308"],
  ["#3b82f6", "#06b6d4", "#14b8a6"],
  ["#a855f7", "#ec4899", "#f43f5e"],
  ["#22c55e", "#10b981", "#14b8a6"],
  ["#eab308", "#f97316", "#ef4444"],
  ["#6366f1", "#a855f7", "#ec4899"],
  ["#ec4899", "#f43f5e", "#f97316"],
  ["#14b8a6", "#06b6d4", "#3b82f6"],
];

function getGradientColors(name: string) {
  if (!name) return GRADIENTS[0];
  const code = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return GRADIENTS[code % GRADIENTS.length];
}

const getPlatformBadge = (platform: string = "") => {
  const p = platform.toLowerCase();
  if (p.includes("pc"))
    return {
      bg: "rgba(59,130,246,0.15)",
      color: "#93c5fd",
      border: "rgba(59,130,246,0.3)",
    };
  if (p.includes("playstation"))
    return {
      bg: "rgba(99,102,241,0.15)",
      color: "#a5b4fc",
      border: "rgba(99,102,241,0.3)",
    };
  if (p.includes("xbox"))
    return {
      bg: "rgba(34,197,94,0.15)",
      color: "#86efac",
      border: "rgba(34,197,94,0.3)",
    };
  if (p.includes("switch"))
    return {
      bg: "rgba(239,68,68,0.15)",
      color: "#fca5a5",
      border: "rgba(239,68,68,0.3)",
    };
  if (p.includes("mobile"))
    return {
      bg: "rgba(236,72,153,0.15)",
      color: "#f9a8d4",
      border: "rgba(236,72,153,0.3)",
    };
  return {
    bg: "rgba(115,115,115,0.15)",
    color: "#d4d4d4",
    border: "rgba(115,115,115,0.3)",
  };
};

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "long",
  });

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div className="relative rounded-2xl border border-neutral-800 bg-neutral-900 p-5 flex flex-col gap-3 overflow-hidden hover:border-orange-500/40 transition-colors duration-150">
      <div
        className="absolute -top-8 -right-8 w-28 h-28 rounded-full blur-3xl opacity-15"
        style={{ background: accent }}
      />
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${accent}25`, border: `1px solid ${accent}40` }}
      >
        <Icon className="h-5 w-5" style={{ color: accent }} />
      </div>
      <div>
        <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
        <p className="text-sm text-neutral-400 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

function MiniGameCard({ game }: { game: GameData }) {
  const platform = getPlatformBadge(game.platform);
  return (
    <div
      className="group relative rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 hover:border-orange-500/40 transition-colors duration-150"
      style={{ aspectRatio: "3/4" }}
    >
      <img
        src={optimizeCoverUrl(game.cover_url)}
        alt={game.name}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

      {game.platform && (
        <span
          className="absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full border backdrop-blur-sm"
          style={{
            background: platform.bg,
            color: platform.color,
            borderColor: platform.border,
          }}
        >
          {game.platform}
        </span>
      )}

      <p className="absolute bottom-3 left-3 right-3 text-white font-semibold text-sm leading-tight line-clamp-2 drop-shadow-lg">
        {game.name}
      </p>
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  count,
  accent,
}: {
  icon: React.ElementType;
  title: string;
  count: number;
  accent: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: `${accent}20`, border: `1px solid ${accent}35` }}
      >
        <Icon className="h-4 w-4" style={{ color: accent }} />
      </div>
      <h2 className="text-base font-bold text-white">{title}</h2>
      <div className="flex-1 h-px bg-neutral-800 mx-2" />
      <span className="text-xs text-neutral-500 bg-neutral-800/80 px-2.5 py-1 rounded-full">
        {count} {count === 1 ? "jogo" : "jogos"}
      </span>
    </div>
  );
}

function GameGrid({ games }: { games: GameData[] }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
      {games.map((g) => (
        <MiniGameCard key={g.id} game={g} />
      ))}
    </div>
  );
}

function SkeletonGrid({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl bg-neutral-800 animate-pulse"
          style={{ aspectRatio: "3/4" }}
        />
      ))}
    </div>
  );
}

function EmptySection({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 rounded-2xl border border-dashed border-neutral-800 text-neutral-600 gap-2">
      <p className="text-sm">{message}</p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PublicProfilePage() {
  const params = useParams();
  const userId = params.id as string;

  const [userName, setUserName] = useState("");
  const [joinedAt, setJoinedAt] = useState("");
  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const [playing, setPlaying] = useState<GameData[]>([]);
  const [wishlist, setWishlist] = useState<GameData[]>([]);
  const [finished, setFinished] = useState<GameData[]>([]);
  const [platinated, setPlatinated] = useState<GameData[]>([]);

  useEffect(() => {
    const init = async () => {
      if (!userId) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const profileRes = await fetchUserProfile(userId);
      if (!profileRes.success || !profileRes.data) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const profile = profileRes.data;
      setUserName(profile.full_name || "Jogador");
      setAvatarUrl(profile.avatar_url);
      setCoverUrl(profile.cover_url);
      setJoinedAt(profile.created_at || "");

      const gamesRes = await fetchUserGames(userId);
      if (gamesRes.success && gamesRes.data) {
        const all = gamesRes.data as GameData[];
        setPlaying(all.filter((g) => g.status === "playing"));
        setWishlist(all.filter((g) => g.status === "wishlist"));
        setFinished(all.filter((g) => g.status === "finished"));
        setPlatinated(all.filter((g) => g.status === "platinated"));
      }

      setLoading(false);
    };
    init();
  }, [userId]);

  if (notFound) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <User className="w-16 h-16 text-neutral-700 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Perfil não encontrado</h1>
          <p className="text-neutral-500 mb-6">
            Não conseguimos encontrar o perfil que você está procurando.
          </p>
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white border border-neutral-800 hover:bg-neutral-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para o Início
          </Link>
        </div>
      </div>
    );
  }

  const firstName = userName.split(" ")[0] || "";
  const initials = userName
    ? userName
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "?";

  const [c0, c1, c2] = getGradientColors(firstName);
  const avatarGradient = `linear-gradient(135deg, ${c0}, ${c1}, ${c2})`;
  const bannerGradient = `linear-gradient(135deg, ${c0}30, ${c1}20, transparent)`;
  const totalGames =
    playing.length + wishlist.length + finished.length + platinated.length;

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col">
      <Navbar />

      {/* ── Banner ── */}
      <div className="relative w-full h-48 shrink-0 overflow-hidden">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt="Capa do perfil"
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{ background: bannerGradient }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-neutral-950/60" />
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 pb-24">
        {/* ── Profile header card ── */}
        <div className="relative -mt-16 mb-8 rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div
                className="w-24 h-24 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-xl overflow-hidden"
                style={{ background: avatarGradient }}
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Foto de perfil"
                    className="w-full h-full object-cover"
                  />
                ) : loading ? (
                  "…"
                ) : (
                  initials
                )}
              </div>
            </div>

            {/* Identity */}
            <div className="flex-1 min-w-0">
              {loading ? (
                <div className="space-y-2">
                  <div className="h-6 w-40 bg-neutral-800 rounded-lg animate-pulse" />
                  <div className="h-4 w-36 bg-neutral-800 rounded-lg animate-pulse" />
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-white truncate">
                    {userName}
                  </h1>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 mt-1.5">
                    {joinedAt && (
                      <span className="flex items-center gap-1.5 text-sm text-neutral-400">
                        <Calendar className="h-3.5 w-3.5 shrink-0" />
                        Membro desde {formatDate(joinedAt)}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 self-start shrink-0">
              <Link
                href="/profile"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-neutral-400 border border-neutral-800 hover:border-violet-500/40 hover:text-violet-400 hover:bg-violet-500/5 transition-all duration-200"
              >
                <User className="h-4 w-4" />
                Meu Perfil
              </Link>
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-neutral-400 border border-neutral-800 hover:border-violet-500/40 hover:text-violet-400 hover:bg-violet-500/5 transition-all duration-200"
              >
                <Home className="h-4 w-4" />
                Início
              </Link>
            </div>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
          <StatCard
            icon={Layers}
            label="Total de jogos"
            value={totalGames}
            accent="#a855f7"
          />
          <StatCard
            icon={Gamepad2}
            label="Jogando agora"
            value={playing.length}
            accent="#3b82f6"
          />
          <StatCard
            icon={Trophy}
            label="Finalizados"
            value={finished.length}
            accent="#10b981"
          />
          <StatCard
            icon={Gem}
            label="Platinados"
            value={platinated.length}
            accent="#38bdf8"
          />
          <StatCard
            icon={Heart}
            label="Lista de desejos"
            value={wishlist.length}
            accent="#ec4899"
          />
        </div>

        {/* ── Playing Now ── */}
        <section className="mb-10">
          <SectionHeader
            icon={Gamepad2}
            title="Jogando Agora"
            count={playing.length}
            accent="#3b82f6"
          />
          {loading ? (
            <SkeletonGrid count={6} />
          ) : playing.length === 0 ? (
            <EmptySection message="Nenhum jogo em andamento." />
          ) : (
            <GameGrid games={playing} />
          )}
        </section>

        {/* ── Finished ── */}
        <section className="mb-10">
          <SectionHeader
            icon={Trophy}
            title="Finalizados"
            count={finished.length}
            accent="#10b981"
          />
          {loading ? (
            <SkeletonGrid count={6} />
          ) : finished.length === 0 ? (
            <EmptySection message="Nenhum jogo finalizado ainda." />
          ) : (
            <GameGrid games={finished} />
          )}
        </section>

        {/* ── Platinated ── */}
        <section className="mb-10">
          <SectionHeader
            icon={Gem}
            title="Platinados"
            count={platinated.length}
            accent="#38bdf8"
          />
          {loading ? (
            <SkeletonGrid count={6} />
          ) : platinated.length === 0 ? (
            <EmptySection message="Nenhuma platina ainda." />
          ) : (
            <GameGrid games={platinated} />
          )}
        </section>

        {/* ── Wishlist ── */}
        <section className="mb-10">
          <SectionHeader
            icon={Heart}
            title="Lista de Desejos"
            count={wishlist.length}
            accent="#ec4899"
          />
          {loading ? (
            <SkeletonGrid count={6} />
          ) : wishlist.length === 0 ? (
            <EmptySection message="A lista de desejos está vazia." />
          ) : (
            <GameGrid games={wishlist} />
          )}
        </section>
      </div>
    </div>
  );
}
