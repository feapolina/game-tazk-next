
import React, { forwardRef } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GameData } from "../../types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/components/ui/alert-dialog";
import { LucideTrash } from "lucide-react";
import { Badge } from "@/app/components/ui/badge";
import { cn } from "@/app/lib/utils"; // Assuming utils exist, or I can use plain template strings if not

interface GameCardProps {
  game: GameData;
  variant: "playing" | "wishlist";
  onRemove?: (id: number) => void;
  onClick?: (game: GameData) => void;
  style?: React.CSSProperties;
  className?: string;
  isOverlay?: boolean;
  isDragging?: boolean;
  disabled?: boolean;
}

// Helper for platform colors
const getPlatformColor = (platform: string = "") => {
  const p = platform.toLowerCase();
  if (p.includes("pc")) return "bg-blue-500 hover:bg-blue-600 text-white border-none";
  if (p.includes("playstation")) return "bg-indigo-600 hover:bg-indigo-700 text-white border-none";
  if (p.includes("xbox")) return "bg-green-600 hover:bg-green-700 text-white border-none";
  if (p.includes("switch")) return "bg-red-600 hover:bg-red-700 text-white border-none";
  if (p.includes("mobile")) return "bg-pink-600 hover:bg-pink-700 text-white border-none";
  return "bg-neutral-600 hover:bg-neutral-700 text-white border-none";
};

// Visual Component (Pure UI)
export const GameCard = forwardRef<HTMLDivElement, GameCardProps>(
  (
    {
      game,
      variant,
      onRemove,
      onClick,
      style,
      className,
      isOverlay,
      isDragging,
      disabled,
      ...props
    },
    ref
  ) => {
    // Common styles
    // touch-none prevents scrolling. We only want that when DND is active (!disabled).
    const touchClass = disabled ? "touch-manipulation" : "touch-none";
    
    const baseClasses =
      `relative rounded-lg shadow-md group hover:shadow-xl transition-all duration-300 cursor-pointer ${touchClass}`;

    const overlayClasses = isOverlay
      ? "scale-105 shadow-2xl ring-2 ring-violet-500/50 rotate-2 cursor-grabbing z-50"
      : "hover:scale-105 cursor-grab active:cursor-grabbing";

    const draggingClasses = isDragging ? "opacity-30 grayscale" : "opacity-100";

    const handleDelete = (e: React.MouseEvent | React.PointerEvent) => {
      e.stopPropagation();
    };

    if (variant === "playing") {
      return (
        <div
          ref={ref}
          style={{
             ...style,
             background: 'linear-gradient(145deg, #575757ff, #000000)',
          }}
          className={cn(
            baseClasses,
            "w-full h-fit p-[1.5px] rounded-[20px] overflow-hidden",
            overlayClasses,
            draggingClasses,
            className
          )}
          {...props}
        >
          <div className="relative w-full h-full bg-neutral-900 rounded-[18px] overflow-hidden flex flex-col">
              <div 
                  onClick={() => onClick?.(game)} 
                  className="w-full h-full p-4 flex flex-col gap-3 group/content"
              >
                  <div className="relative w-full aspect-[4/3] overflow-hidden rounded-[14px]">
                       <img
                        src={game.cover_url}
                        alt={game.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover/content:scale-110 pointer-events-none"
                      />
                      <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/60 pointer-events-none" />
                  </div>
                  
                  <div className="space-y-2 pointer-events-none">
                     <h3 className="text-white font-bold text-lg leading-tight line-clamp-1 pointer-events-none">
                        {game.name}
                     </h3>
                     <div className="flex justify-between items-center w-full">
                        <Badge className={getPlatformColor(game.platform)}>{game.platform || "PC"}</Badge>
                        
                     </div>
                  </div>
              </div>

              {!isOverlay && onRemove && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      className="absolute top-3 right-3 text-white/70 bg-black/40 hover:bg-black/80 p-1.5 rounded-full backdrop-blur-sm transition-all hover:text-red-400 cursor-pointer"
                      onPointerDown={handleDelete}
                      onClick={handleDelete}
                    >
                      <LucideTrash size={16} />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Tem certeza que deseja excluir esse jogo?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Essa ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={(e) => { e.stopPropagation(); onRemove(game.id); }}>
                        Deletar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
          </div>
        </div>
      );
    }

    // Wishlist variant
    return (
      <div
        ref={ref}
        style={{
             ...style,
             background: 'linear-gradient(145deg, #575757ff',
          }}
        className={cn(
          baseClasses,
          "w-full h-full p-[1.5px] rounded-[20px] overflow-hidden", // h-full for wishlist to fill grid?
          overlayClasses,
          draggingClasses,
          className
        )}
        {...props}
      >
        <div className="relative w-full h-full bg-neutral-900 rounded-[18px] overflow-hidden">
            <div onClick={() => onClick?.(game)} className="w-full h-full relative group/content">
                <img
                  src={game.cover_url}
                  alt={game.name}
                  loading="lazy"
                  className="w-full h-full object-cover pointer-events-none transition-transform duration-500 group-hover/content:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
                <h3 className="absolute bottom-4 left-4 right-4 text-white font-bold text-lg leading-tight line-clamp-2 pointer-events-none drop-shadow-lg">
                  {game.name}
                </h3>
            </div>

            {!isOverlay && onRemove && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    className="absolute top-3 right-3 text-white/70 bg-black/40 hover:bg-black/80 p-1.5 rounded-full backdrop-blur-sm transition-all hover:text-red-400 cursor-pointer"
                    onPointerDown={handleDelete}
                    onClick={handleDelete}
                  >
                    <LucideTrash size={16} />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Tem certeza que deseja excluir esse jogo?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Essa ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={(e) => { e.stopPropagation(); onRemove(game.id); }}>
                      Deletar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
        </div>
      </div>
    );
  }
);

GameCard.displayName = "GameCard";

// Logic Component (Dnd Wrapper)
interface DraggableGameCardProps extends GameCardProps {
  disabled?: boolean;
}

export function DraggableGameCard({
  game,
  variant,
  onRemove,
  onClick,
  disabled,
  ...props
}: DraggableGameCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: game.id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <GameCard
      ref={setNodeRef}
      style={style}
      game={game}
      variant={variant}
      onRemove={onRemove}
      onClick={onClick}
      isDragging={isDragging}
      disabled={disabled}
      {...attributes}
      {...listeners}
      {...props}
    />
  );
}
