import { Skeleton } from "@/app/components/ui/skeleton";

const GameImageSkeleton = () => {
  return (
    <div className="relative w-full rounded-lg overflow-hidden shadow-md group hover:shadow-xl transition-shadow duration-200">
      {/* Imagem skeleton */}
      <Skeleton className="w-full h-40" />

      {/* Gradiente overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

      {/* Título skeleton */}
      <div className="absolute bottom-3 left-2 right-2">
        <Skeleton className="h-6 w-3/4 bg-white/20" />
      </div>

      {/* Botão de trash skeleton */}
      <div className="absolute top-2 right-2">
        <Skeleton className="h-5 w-5 rounded-full bg-white/20" />
      </div>
    </div>
  );
};

// Para renderizar múltiplos skeletons
const GameImageSkeletonGrid = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <GameImageSkeleton key={index} />
        ))}
    </div>
  );
};

export { GameImageSkeleton, GameImageSkeletonGrid };
