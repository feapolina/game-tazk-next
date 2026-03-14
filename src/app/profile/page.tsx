"use client";

import { useState, useEffect, useRef } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Gamepad2,
  Trophy,
  Heart,
  Layers,
  LogOut,
  User,
  Calendar,
  ChevronRight,
  Camera,
  Loader2,
  Home,
  Undo2,
} from "lucide-react";
import { useToast } from "@/app/hooks/use-toast";
import { Toaster } from "@/app/components/ui/toaster";
import { updateGameStatus } from "@/app/gameService";
import { uploadProfilePicture, getAvatarUrl } from "@/app/lib/avatarService";
import Navbar from "@/app/components/custom_components/Navbar";
import Footer from "@/app/components/custom_components/Footer";
import { fetchGamesListFromDatabase } from "@/app/gameService";
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

function MiniGameCard({
  game,
  badge,
  onUnfinish,
}: {
  game: GameData;
  badge?: React.ReactNode;
  onUnfinish?: (game: GameData) => void;
}) {
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

      {badge && <div className="absolute top-2 right-2">{badge}</div>}

      {onUnfinish && (
        <button
          onClick={() => onUnfinish(game)}
          title="Desfazer finalização"
          className="absolute bottom-10 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold text-amber-300 bg-black/70 border border-amber-400/40 hover:bg-amber-500/20 hover:border-amber-400/70 hover:text-amber-200 backdrop-blur-sm cursor-pointer"
        >
          <Undo2 className="h-3 w-3" />
          Desfazer
        </button>
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

function GameGrid({
  games,
  badge,
  onUnfinish,
}: {
  games: GameData[];
  badge?: (g: GameData) => React.ReactNode;
  onUnfinish?: (game: GameData) => void;
}) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
      {games.map((g) => (
        <MiniGameCard key={g.id} game={g} badge={badge?.(g)} onUnfinish={onUnfinish} />
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
      <Link
        href="/"
        className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 mt-1 transition-colors"
      >
        Ir para minha coleção <ChevronRight className="h-3 w-3" />
      </Link>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { toast } = useToast();
  const supabase = createClientComponentClient();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [joinedAt, setJoinedAt] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [playing, setPlaying] = useState<GameData[]>([]);
  const [wishlist, setWishlist] = useState<GameData[]>([]);
  const [finished, setFinished] = useState<GameData[]>([]);

  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUserId(user.id);
      setUserName(
        user.user_metadata?.full_name || user.email?.split("@")[0] || "Jogador",
      );
      setUserEmail(user.email || "");
      setJoinedAt(user.created_at || "");
      setAvatarUrl(getAvatarUrl(user));

      const result = await fetchGamesListFromDatabase();
      if (result.success && result.data) {
        const all = result.data as GameData[];
        setPlaying(all.filter((g) => g.status === "playing"));
        setWishlist(all.filter((g) => g.status === "wishlist"));
        setFinished(all.filter((g) => g.status === "finished"));
      }

      setLoading(false);
    };
    init();
  }, [supabase, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/welcome");
  };

  const handleUnfinishGame = async (game: GameData) => {
    // Optimistic update: move immediately from finished -> playing in local state
    setFinished((prev) => prev.filter((g) => g.id !== game.id));
    setPlaying((prev) => [...prev, { ...game, status: "playing" }]);

    const result = await updateGameStatus(game.id, "playing");
    if (result.success) {
      toast({
        title: "Jogo reativado! 🎮",
        description: `${game.name} foi movido de volta para "Jogando Agora".`,
      });
    } else {
      // Rollback on failure
      setPlaying((prev) => prev.filter((g) => g.id !== game.id));
      setFinished((prev) => [...prev, { ...game, status: "finished" }]);
      toast({
        title: "Erro ao desfazer finalização",
        description: "Não foi possível atualizar o status do jogo.",
        variant: "destructive",
      });
    }
  };

  const handleAvatarClick = () => {
    if (!uploading) fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    setUploading(true);
    setUploadError(null);

    const result = await uploadProfilePicture(file, userId, supabase);

    if (result.success && result.url) {
      setAvatarUrl(result.url);
    } else {
      setUploadError(result.error ?? "Erro desconhecido.");
      // Auto-clear error after 4 seconds
      setTimeout(() => setUploadError(null), 4000);
    }

    setUploading(false);
    // Reset input so the same file can be re-selected after an error
    e.target.value = "";
  };

  const firstName = userName.split(" ")[0];
  const initials =
    userName
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "?";

  const [c0, c1, c2] = getGradientColors(firstName);
  const avatarGradient = `linear-gradient(135deg, ${c0}, ${c1}, ${c2})`;
  const bannerGradient = `linear-gradient(135deg, ${c0}30, ${c1}20, transparent)`;
  const totalGames = playing.length + wishlist.length + finished.length;

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col">
      <Toaster />
      <Navbar />

      {/* ── Banner ── */}
      <div
        className="w-full h-40 shrink-0"
        style={{ background: bannerGradient }}
      />

      {/* ── Main content ── */}
      <div className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 pb-24">
        {/* ── Profile header card ── */}
        <div className="relative -mt-16 mb-8 rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            {/* Avatar — clickable upload trigger */}
            <div
              className="relative shrink-0 group/avatar"
              onClick={handleAvatarClick}
            >
              <div
                className="w-24 h-24 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-xl overflow-hidden cursor-pointer"
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

              {/* Camera overlay */}
              <div className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                {uploading ? (
                  <Loader2 className="h-6 w-6 text-white animate-spin" />
                ) : (
                  <Camera className="h-6 w-6 text-white" />
                )}
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleAvatarChange}
                disabled={uploading}
              />
            </div>

            {/* Upload error toast */}
            {uploadError && (
              <div className="absolute left-0 right-0 -bottom-12 mx-6 px-4 py-2 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-medium text-center">
                {uploadError}
              </div>
            )}

            {/* Identity */}
            <div className="flex-1 min-w-0">
              {loading ? (
                <div className="space-y-2">
                  <div className="h-6 w-40 bg-neutral-800 rounded-lg animate-pulse" />
                  <div className="h-4 w-56 bg-neutral-800 rounded-lg animate-pulse" />
                  <div className="h-4 w-36 bg-neutral-800 rounded-lg animate-pulse" />
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-white truncate">
                    {userName}
                  </h1>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 mt-1.5">
                    <span className="flex items-center gap-1.5 text-sm text-neutral-400">
                      <User className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{userEmail}</span>
                    </span>
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
                href="/"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-neutral-400 border border-neutral-800 hover:border-violet-500/40 hover:text-violet-400 hover:bg-violet-500/5 transition-all duration-200"
              >
                <Home className="h-4 w-4" />
                Início
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-neutral-400 border border-neutral-800 hover:border-red-500/40 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200 cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </button>
            </div>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
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
            <SkeletonGrid count={3} />
          ) : finished.length === 0 ? (
            <EmptySection message="Nenhum jogo finalizado ainda." />
          ) : (
            <GameGrid
              games={finished}
              onUnfinish={handleUnfinishGame}
              badge={() => (
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center shadow-lg"
                  style={{ background: "rgba(16,185,129,0.85)" }}
                >
                  <Trophy className="h-3 w-3 text-white" />
                </div>
              )}
            />
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
            <SkeletonGrid count={4} />
          ) : wishlist.length === 0 ? (
            <EmptySection message="Nenhum jogo na lista de desejos." />
          ) : (
            <GameGrid games={wishlist} />
          )}
        </section>

        {/* ── Full empty state ── */}
        {!loading && totalGames === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-neutral-500">
            <div className="w-20 h-20 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center">
              <Gamepad2 className="h-10 w-10 opacity-30" />
            </div>
            <p className="text-base font-medium text-neutral-400">
              Sua coleção está vazia
            </p>
            <p className="text-sm text-center max-w-xs">
              Adicione jogos na sua lista e eles aparecerão aqui.
            </p>
            <Link
              href="/"
              className="mt-2 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
              style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}
            >
              <Gamepad2 className="h-4 w-4" />
              Ir para minha coleção
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
