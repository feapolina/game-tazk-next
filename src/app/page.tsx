"use strict";
"use client";

import { useState, useEffect } from "react";
import { Toaster } from "@/app/components/ui/toaster";
import { useToast } from "@/app/hooks/use-toast";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";

import CountUp from "@/app/components/react-bits/CountUp";import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";

import Image from "next/image";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { GameData } from "./types";
import {
  fetchGamesListFromDatabase,
  saveGameInDatabase,
  deleteGameFromDatabase,
  updateGameStatus,
  fetchTodoForGameFromDatabase,
} from "./gameService";
import { DraggableGameCard, GameCard } from "@/app/components/custom_components/DraggableGameCard";
import SearchbarWithList from "@/app/components/custom_components/SearchBar";
import ToDoList from "@/app/components/custom_components/ToDoListComponent";
import Footer from "@/app/components/custom_components/Footer";
import { GameImageSkeletonGrid } from "@/app/components/custom_components/GameImageSkeleton";
import DroppableContainer from "@/app/components/custom_components/DroppableContainer";
import EmptyListMessage from "@/app/components/custom_components/EmptyListMessage";
import Navbar from "@/app/components/custom_components/Navbar";

export default function HomePage() {
  const { toast } = useToast();
  const [selectedGames, setSelectedGames] = useState<GameData[]>([]);
  const [wishlistSelectedGames, setWishlistSelectedGames] = useState<
    GameData[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentGame, setCurrentGame] = useState<GameData | null>(null);
  const [taskCount, setTaskCount] = useState(0);
  const [activeGame, setActiveGame] = useState<GameData | null>(null);
  
  // New State for Platform Selection
  const [gameToAdd, setGameToAdd] = useState<GameData | null>(null);
  const [isPlatformDialogOpen, setIsPlatformDialogOpen] = useState(false);
  const [deletingGames, setDeletingGames] = useState<number[]>([]);
  

  
  // Mobile Detection
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Check initially
    checkMobile();
    
    // Add listener
    window.addEventListener("resize", checkMobile);
    
    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch count when game opens
  useEffect(() => {
    if (currentGame) {
        fetchTodoForGameFromDatabase(currentGame.id).then((result) => {
            if (result.success && result.data) {
                setTaskCount(result.data.length);
            } else {
                setTaskCount(0);
            }
        });
    } else {
        setTaskCount(0);
    }
  }, [currentGame]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

// ... (rest of code) ...



  useEffect(() => {
    const loadGames = async () => {
      setIsLoading(true);
      try {
        const result = await fetchGamesListFromDatabase();
        if (result.success) {
          const games = result.data ?? [];
          setSelectedGames(games.filter((game) => game.status === "playing"));
          setWishlistSelectedGames(
            games.filter((game) => game.status === "wishlist")
          );
        } else {
          console.error("Erro ao buscar jogos: ", result.error);
          toast({
            title: "Erro ao buscar os jogos",
            description: "Não foi possível buscar os jogos no banco de dados.",
            variant: "destructive",
          });
        }
      } catch (err) {
        console.error("Error fetching games:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadGames();
  }, [toast]);

  const handleAddGame = async (gameFromSearch: GameData) => {
    // Instead of saving immediately, open the platform dialog
    setGameToAdd(gameFromSearch);
    setIsPlatformDialogOpen(true);
  };

  const handleConfirmAddGame = async (platform: string) => {
    if (!gameToAdd) return;

    const result = await saveGameInDatabase(gameToAdd, "playing", platform);
    if (result.success) {
      setSelectedGames((prev) => [
        ...prev,
        {
          ...gameToAdd,
          cover_url: gameToAdd.cover_url,
          platform: platform,
        },
      ]);
      toast({
        title: "Jogo adicionado!",
        description: `${gameToAdd.name} foi adicionado na plataforma ${platform}.`,
      });
      setIsPlatformDialogOpen(false);
      setGameToAdd(null);
    } else {
      toast({
        title: "Erro ao adicionar o jogo",
        description: "Não foi possível adicionar o jogo ao banco de dados.",
        variant: "destructive",
      });
    }
  };

  const handleAddGameToWishlist = async (gameFromSearch: GameData) => {
    const result = await saveGameInDatabase(gameFromSearch, "wishlist");
    if (result.success) {
      setWishlistSelectedGames((prev) => [
        ...prev,
        {
          ...gameFromSearch,
          cover_url: gameFromSearch.cover_url,
        },
      ]);
      toast({
        title: "Jogo adicionado!",
        description: `${gameFromSearch.name} foi adicionado.`,
      });
    } else {
      toast({
        title: "Erro ao adicionar o jogo",
        description: "Não foi possível adicionar o jogo ao banco de dados.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveGame = async (id: number) => {
    // 0. Find game name for toast
    const gameToRemove = selectedGames.find((g) => g.id === id);
    const gameName = gameToRemove?.name || "O jogo";

    // 1. Start animation
    setDeletingGames((prev) => [...prev, id]);

    // 2. Wait for animation
    setTimeout(async () => {
      const result = await deleteGameFromDatabase(id);
      if (result.success) {
        setSelectedGames((prev) => prev.filter((game) => game.id !== id));
        toast({
          title: "Jogo removido!",
          description: `${gameName} foi removido com sucesso.`,
        });
      } else {
        toast({
          title: "Erro ao remover o jogo",
          description: "Não foi possível remover o jogo do banco de dados.",
          variant: "destructive",
        });
        // If failed, remove from deleting list so it reappears/interactable
        setDeletingGames((prev) => prev.filter((gameId) => gameId !== id));
      }
    }, 300); // 300ms matches standard transition duration
  };

  const handleRemoveGameFromWishlist = async (id: number) => {
    // 0. Find game name for toast
    const gameToRemove = wishlistSelectedGames.find((g) => g.id === id);
    const gameName = gameToRemove?.name || "O jogo";

    // 1. Start animation
    setDeletingGames((prev) => [...prev, id]);

    // 2. Wait for animation
    setTimeout(async () => {
      const result = await deleteGameFromDatabase(id);
      if (result.success) {
        setWishlistSelectedGames((prev) => prev.filter((game) => game.id !== id));
        toast({
          title: "Jogo removido!",
          description: `${gameName} foi removido com sucesso da lista de desejos.`,
        });
      } else {
        toast({
          title: "Erro ao remover o jogo",
          description: "Não foi possível remover o jogo do banco de dados.",
          variant: "destructive",
        });
        setDeletingGames((prev) => prev.filter((gameId) => gameId !== id));
      }
    }, 300);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const activeId = Number(event.active.id);
    const game =
      selectedGames.find((g) => g.id === activeId) ||
      wishlistSelectedGames.find((g) => g.id === activeId);
    if (game) setActiveGame(game);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveGame(null);

    if (!over) return;

    const activeId = Number(active.id);
    const overId = over.id; // can be string (container) or number (item)

    // Find where the item came from
    const isFromPlaying = selectedGames.some((g) => g.id === activeId);
    const isFromWishlist = wishlistSelectedGames.some((g) => g.id === activeId);
    
    // Find where appropriate item is going
    // NOTE: overId can be the container ID ("playing-list", "wishlist-list") OR a game ID inside that list.
    
    let targetContainer: "playing" | "wishlist" | null = null;

    if (overId === "playing-list") targetContainer = "playing";
    else if (overId === "wishlist-list") targetContainer = "wishlist";
    else {
      // It's over another item, check which list that item belongs to
       const isOverPlayingItem = selectedGames.some((g) => g.id === Number(overId));
       const isOverWishlistItem = wishlistSelectedGames.some((g) => g.id === Number(overId));
       
       if (isOverPlayingItem) targetContainer = "playing";
       else if (isOverWishlistItem) targetContainer = "wishlist";
    }

    if (!targetContainer) return; // Dropped somewhere unknown

    // If dropped in the same list, just do nothing (or reorder if we supported full reordering)
    if (isFromPlaying && targetContainer === "playing") return;
    if (isFromWishlist && targetContainer === "wishlist") return;

    // Moving Logic
    const gameToMove = isFromPlaying
      ? selectedGames.find((g) => g.id === activeId)
      : wishlistSelectedGames.find((g) => g.id === activeId);

    if (!gameToMove) return;

    // Optimistic Update
    if (targetContainer === "playing") {
        setWishlistSelectedGames(prev => prev.filter(g => g.id !== activeId));
        setSelectedGames(prev => [...prev, {...gameToMove, status: "playing"} as GameData]); // status field update relies on local shape if it existed
    } else {
      setSelectedGames(prev => prev.filter(g => g.id !== activeId));
        setWishlistSelectedGames(prev => [...prev, {...gameToMove, status: "wishlist"} as GameData]);
    }

    // Backend Update
    await updateGameStatus(activeId, targetContainer);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div id="wrapper" className="min-h-screen">
        <Toaster />
        <div className="min-h-screen bg-[#f5f5f5] dark:bg-neutral-950 transition-colors duration-200 font-display antialiased">
          <Navbar />
          <div className="container mx-auto px-4 flex flex-col justify-center items-center">
            {/* Old Logo Removed from here */}
            

            <SearchbarWithList
              onAddGameToWishlist={handleAddGameToWishlist}
              onAddGame={handleAddGame}
            />

            <div className="w-full h-full mt-10 mb-20">
              {/* Jogando Agora */}
              <div className="flex gap-3 justify-center ">
                <div className="w-2 h-10 bg-violet-700"></div>
                <h2 className="font-bold text-4xl w-full h-full mb-5 text-neutral-800 dark:text-gray-100">
                  Jogando Agora
                </h2>
              </div>

              {isLoading ? (
                <GameImageSkeletonGrid count={3} />
              ) : (
                <DroppableContainer id="playing-list">
                  <SortableContext
                    items={selectedGames.map((g) => g.id)}
                    strategy={rectSortingStrategy}
                  >
                    {selectedGames.length === 0 ? (
                      <EmptyListMessage />
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 place-items-center gap-6  ">
                        {selectedGames.map((game) => (
                          <DraggableGameCard
                            key={game.id}
                            game={game}
                            variant="playing"
                            disabled={isMobile}
                            onRemove={handleRemoveGame}
                            className={deletingGames.includes(game.id) ? "opacity-0 scale-90 pointer-events-none" : ""}
                            onClick={(g) => {
                              setCurrentGame(g);
                              setIsModalOpen(true);
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </SortableContext>
                </DroppableContainer>
              )}
            </div>

            {/* Lista de desejos */}
            <div className="w-full h-full mt-10 mb-20 ">
              <div className="flex gap-3 justify-center ">
                <div className="w-2 h-10 bg-amber-400"></div>
                <h2 className="font-bold text-4xl w-full h-full mb-5 text-neutral-800 dark:text-gray-100">
                  Lista de desejos
                </h2>
              </div>
              {isLoading ? (
                <GameImageSkeletonGrid count={3} />
              ) : (
                <DroppableContainer id="wishlist-list">
                    <SortableContext
                        items={wishlistSelectedGames.map((g) => g.id)}
                        strategy={rectSortingStrategy}
                    >
                    {wishlistSelectedGames.length === 0 ? (
                        <EmptyListMessage />
                    ) : (
                        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
                        {wishlistSelectedGames.map((game) => (
                            <DraggableGameCard
                            key={game.id}
                            game={game}
                            variant="wishlist"
                            disabled={isMobile}
                            onRemove={handleRemoveGameFromWishlist}
                            className={deletingGames.includes(game.id) ? "opacity-0 scale-90 pointer-events-none" : ""}
                            />
                        ))}
                        </div>
                    )}
                    </SortableContext>
                </DroppableContainer>
              )}
            </div>
          </div>
        </div>

        <DragOverlay>
            {activeGame ? (
                <GameCard 
                    game={activeGame} 
                    variant={activeGame.status as "playing" | "wishlist"} 
                    isOverlay 
                />
            ) : null}
        </DragOverlay>

        <Dialog open={isModalOpen} onOpenChange={() => setIsModalOpen(false)}>
          <DialogContent className="sm:max-w-2xl p-0 gap-0 overflow-hidden bg-[#f5f5f5] dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
             <DialogHeader className="sr-only">
               <DialogTitle>Lista de tarefas para {currentGame?.name}</DialogTitle>
             </DialogHeader>
             
             {/* Custom Header Section */}
             <div className="relative w-full h-56 bg-neutral-900">
                {currentGame?.cover_url && (
                    <img 
                      src={currentGame.cover_url.replace("t_thumb", "t_1080p")} 
                      alt={currentGame.name}
                      className="w-full h-full object-cover opacity-90"
                    />
                )}
                {/* Gradient Overlay (Darker at bottom) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
                
                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-row items-end justify-between z-10">
                    <div className="space-y-1">
                        <Label className="text-white/60 text-xs font-medium uppercase tracking-wider">Gerenciando</Label>
                        <h2 className="text-3xl font-bold text-white tracking-tight drop-shadow-lg leading-none">
                            {currentGame?.name}
                        </h2>
                    </div>
                    
                    {/* Count Up Component */}
                    <div className="flex flex-col items-end space-y-1">
                        <span className="text-xs font-medium text-white/50 uppercase tracking-wider">Tarefas</span>
                        <div className="text-4xl font-bold text-white tracking-tighter drop-shadow-lg leading-none">
                            <CountUp
                              from={0}
                              to={taskCount}
                              separator=","
                              direction="up"
                              duration={1}
                              className="count-up-text"
                            />
                        </div>
                    </div>
                </div>
             </div>

            <div className="p-6">
              <ToDoList gameId={currentGame?.id} />
            </div>
          </DialogContent>
        </Dialog>

        {/* Platform Selection Dialog */}
        <Dialog open={isPlatformDialogOpen} onOpenChange={setIsPlatformDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar {gameToAdd?.name}</DialogTitle>
            </DialogHeader>
            <div className="grid w-full items-center gap-4">
              <Label className="text-center mb-2">Selecione a plataforma</Label>
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  className="bg-neutral-500 hover:bg-neutral-600 text-white min-w-[100px]" 
                  onClick={() => handleConfirmAddGame("PC")}
                >
                  PC
                </Button>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white min-w-[100px]" 
                  onClick={() => handleConfirmAddGame("PlayStation")}
                >
                  PlayStation
                </Button>
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white min-w-[100px]" 
                  onClick={() => handleConfirmAddGame("Xbox")}
                >
                  Xbox
                </Button>
                <Button 
                  className="bg-red-600 hover:bg-red-700 text-white min-w-[100px]" 
                  onClick={() => handleConfirmAddGame("Switch")}
                >
                  Switch
                </Button>
                <Button 
                  className="bg-neutral-900 hover:bg-black text-white min-w-[100px]" 
                  onClick={() => handleConfirmAddGame("Mobile")}
                >
                  Mobile
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Footer />
      </div>
    </DndContext>
  );
}
