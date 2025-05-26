"use client";

import { useState, useEffect } from "react";
import { Toaster } from "@/app/components/ui/toaster";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
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

import { LucideFrown, LucideTrash } from "lucide-react";
import {
  GameImageSkeleton,
  GameImageSkeletonGrid,
} from "@/app/components/custom_components/GameImageSkeleton";
import SearchbarWithList from "@/app/components/custom_components/SearchBar";
import Footer from "@/app/components/custom_components/Footer";
import ToDoList from "@/app/components/custom_components/ToDoListComponent";

import Image from "next/image";

import { fetchGames, addGameToSelected, removeGame } from "./apiService";

interface Game {
  id?: string;
  name: string;
  image: string;
}

export default function HomePage() {
  const [selectedGames, setSelectedGames] = useState<Game[]>([]);
  const [wishlistSelectedGames, setWishlistSelectedGames] = useState<Game[]>(
    []
  );
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlayingListEmpty, setIsPlayingListEmpty] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isWishlistEmpty, setIsWishlistEmpty] = useState(true);

  useEffect(() => {
    const loadGames = async () => {
      setIsLoading(true);
      try {
        const data = await fetchGames();
        setSelectedGames(data);
        setIsPlayingListEmpty(data.length === 0);
      } catch (err) {
        console.error("Error fetching games:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadGames();
  }, []);

  const handleAddGame = async (game: Game) => {
    const alreadyAdded = selectedGames.some((g) => g.name === game.name);
    if (alreadyAdded) {
      return;
    }

    try {
      await addGameToSelected(game);
      const updated = await fetchGames();
      console.log("jogos retornados do supabase: ", updated);
      setSelectedGames(updated);
      setIsPlayingListEmpty(updated.length === 0);
    } catch (err) {
      console.error("Error adding game:", err);
    }
  };

  const handleAddGameToWishlist = (game: Game) => {
    setWishlistSelectedGames((prevGames) => {
      if (prevGames.some((g) => g.name === game.name)) return prevGames;
      const updated = [...prevGames, game];
      localStorage.setItem("wishlistSelectedGames", JSON.stringify(updated));
      setIsWishlistEmpty(false);
      return updated;
    });
  };

  const handleRemoveGame = (name: string) => {
    const updated = selectedGames.filter((g) => g.name !== name);
    setSelectedGames(updated);
    localStorage.setItem("selectedGames", JSON.stringify(updated));
    setIsPlayingListEmpty(updated.length === 0);

    const updatedWishlist = wishlistSelectedGames.filter(
      (g) => g.name !== name
    );
    setWishlistSelectedGames(updatedWishlist);
    localStorage.setItem(
      "wishlistSelectedGames",
      JSON.stringify(updatedWishlist)
    );
    setIsWishlistEmpty(updatedWishlist.length === 0);
  };

  const EmptyListMessage = () => (
    <div className="bg-neutral-800 w-full h-64 outline-2 outline-offset-2 outline-dashed rounded-xl outline-gray-400 flex justify-center items-center mb-10">
      <div className="flex flex-col justify-center items-center gap-4 text-gray-400">
        <LucideFrown className="size-14 " />
        <span>Ops.. parece que você não tem nada nessa lista ainda.</span>
      </div>
    </div>
  );

  return (
    <div id="wrapper" className={`min-h-screen ${"dark"}`}>
      <Toaster />
      <div className="min-h-screen bg-[#f5f5f5] dark:bg-neutral-900 transition-colors duration-200 font-display antialiased">
        <div className="container mx-auto px-4 flex flex-col justify-center items-center">
          <div className="flex w-full gap-12 justify-center items-center p-4">
            <Image
              src="/assets/logo_nebulosa_app.svg"
              width={250}
              height={50}
              alt="Logo"
            />
          </div>

          <SearchbarWithList
            onAddGameToWishlist={handleAddGameToWishlist}
            onAddGame={handleAddGame}
          />

          {/* Jogando Agora */}
          <h2 className="font-bold text-4xl w-full h-full m-6 dark:text-gray-100">
            Jogando Agora
          </h2>
          {isLoading ? (
            <GameImageSkeletonGrid count={5} />
          ) : isPlayingListEmpty ? (
            <EmptyListMessage />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 place-items-center gap-6  ">
              {selectedGames.map((game) => (
                <div
                  key={game.name}
                  className="relative bg-neutral-800 w-full h-fit rounded-lg shadow-md group hover:shadow-xl hover:scale-105 transition-shadow duration-300 cursor-pointer p-2 pb-4 "
                  onClick={() => {
                    setCurrentGame(game);
                    setIsModalOpen(true);
                  }}
                >
                  <img
                    src={game.image}
                    alt={game.name}
                    className="w-full rounded-md h-64 object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-linear-to-b from-black/25 to-transparent" />
                  <h3 className="mt-4 bottom-3 left-2 right-2 text-white font-bold text-lg leading-tight line-clamp-2">
                    {game.name}
                  </h3>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-400 text-sm">Switch</span>
                    <span className="text-gray-400 text-sm">Progresso: 0%</span>
                  </div>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        className="absolute top-2 right-2 text-white/50 rounded-full size-5 flex items-center justify-center cursor-pointer transition-colors hover:text-red-400"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <LucideTrash />
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
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleRemoveGame(game.name)}
                        >
                          Deletar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          )}

          {/* Lista de desejos */}
          <div className="w-full h-full mt-10 mb-20">
            <h2 className="font-bold text-4xl w-full h-full mb-5  dark:text-gray-100">
              Lista de desejos
            </h2>
            {isLoading ? (
              <GameImageSkeletonGrid count={3} />
            ) : isWishlistEmpty ? (
              <EmptyListMessage />
            ) : (
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
                {wishlistSelectedGames.map((game) => (
                  <div
                    key={game.name}
                    className="relative w-100 rounded-lg overflow-hidden shadow-md group hover:shadow-xl transition-shadow duration-200"
                  >
                    <img
                      src={game.image}
                      alt={game.name}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent" />
                    <h3 className="absolute bottom-3 left-2 right-2 text-white font-bold text-lg leading-tight line-clamp-2">
                      {game.name}
                    </h3>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          className="absolute top-2 right-2 text-white/50 rounded-full size-5 flex items-center justify-center transition-colors hover:text-red-400 cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <LucideTrash />
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
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleRemoveGame(game.name)}
                          >
                            Deletar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={() => setIsModalOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lista de tarefas para {currentGame?.name}</DialogTitle>
          </DialogHeader>
          <div>
            <ToDoList gameName={currentGame?.name || ""} />
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
