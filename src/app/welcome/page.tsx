"use client";

import { useMobile } from "@/hooks/use-mobile";
import MagicBento from "@/components/MagicBento";
import Navbar from "../components/custom_components/Navbar";
import Footer from "../components/custom_components/Footer";
import ChromaGrid from "@/app/components/react-bits/ChromaGrid";
import { GridPattern } from "@/app/components/ui/grid-pattern";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/app/lib/utils";
import SpotlightCard from "@/components/SpotlightCard";
import Image from "next/image";

export default function WelcomePage() {
  const isMobile = useMobile();

  return (
    <div className="bg-background text-foreground selection:bg-violet-500/30">
      {/* Section 1: Hero (Full Screen) */}
      <section className="relative h-screen w-full flex flex-col overflow-hidden">
        {/* Background Layer */}
        <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
          <GridPattern
            width={40}
            height={40}
            x={-1}
            y={-1}
            className={cn(
              "[mask-image:linear-gradient(to_bottom_right,white,gray,transparent)] ",
              "opacity-50"
            )}
            squares={[
              [4, 4],
              [5, 1],
              [8, 2],
              [5, 3],
              [5, 5],
              [10, 10],
              [12, 15],
              [15, 10],
              [10, 15],

            ]}
          />
        </div>

        {/* Content Layer */}
        <div className="relative z-10 flex flex-col h-full">
          <Navbar transparent />

          <main
            className={`flex-grow flex flex-col items-center justify-center p-8 text-center ${
              isMobile ? "" : "animate-in zoom-in-95 duration-1000"
            }`}
          >
            <div className="max-w-3xl space-y-8">
              <h1 className="text-3xl md:text-6xl font-bold tracking-tighter leading-tight py-2 bg-gradient-to-br from-violet-400 via-fuchsia-300 to-white bg-clip-text text-transparent drop-shadow-sm">
                Seu organizador definitivo de bibliotecas de jogos.
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light max-w-2xl mx-auto">
                Gerencie, acompanhe e descubra sua próxima{" "}
                <span className="font-semibold text-purple-600">gameplay</span>.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-9">
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto font-semibold px-8 h-12 rounded-full shadow-[0_0_20px_rgba(139,92,246,0.3)] border-0"
                  >
                    Começar
                  </Button>
                </Link>
                <Link href="#features">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto px-8 h-12 rounded-full backdrop-blur-sm"
                  >
                    Ver Funcionalidades
                  </Button>
                </Link>
              </div>
            </div>
          </main>

          {/* Scroll Indicator */}
          <div
            className={`absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground ${
              isMobile ? "" : "animate-bounce"
            }`}
          >
            <span className="text-sm tracking-widest uppercase opacity-50">
              Role para ver mais
            </span>
          </div>
        </div>
      </section>

      {/* Section 2: Features */}
      <section
        id="features"
        className="min-h-screen bg-[#121212] border-t border-border p-8 md:p-20 flex flex-col items-center justify-center"
      >
        <div className="w-full space-y-16">
          <div style={{ minHeight: "600px", position: "relative" }}>
            <div className="text-center space-y-4 pointer-events-auto">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
                Funcionalidades
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Tudo que você precisa para assumir o controle da sua coleção de
                jogos.
              </p>
            </div>
            <section className="flex flex-row items-center justify-center gap-8 mt-12">
              <SpotlightCard
                className="custom-spotlight-card w-auto h-"
                spotlightColor="rgba(0, 229, 255, 0.2)"
              >
                <h2 className="text-2xl font-bold">Acompanhe seus jogos</h2>
                <p className="text-muted-foreground text-lg mb-4">
                  Registre todos os jogos que você está jogando no momento.
                </p>
                <div>
                  <Image
                    src="https://xnwjumqehhbrsbcupouv.supabase.co/storage/v1/object/public/nebula-images/PlayingNow-Pic.png"
                    alt="Spotlight"
                    width={1200}
                    height={720}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </SpotlightCard>
              <SpotlightCard
                className="custom-spotlight-card w-auto h-"
                spotlightColor="rgba(0, 229, 255, 0.2)"
              >
                <h2 className="text-2xl font-bold">
                  Salve suas tarefas para depois
                </h2>
                <p className="text-muted-foreground text-lg mb-4">
                  Pra quem joga vários jogos ao mesmo tempo, perder-se em
                  objetivos se torna comum.
                </p>
                <div>
                  <Image
                    src="https://xnwjumqehhbrsbcupouv.supabase.co/storage/v1/object/public/nebula-images/ToDoList-Pic.png"
                    alt="Spotlight"
                    width={1200}
                    height={720}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </SpotlightCard>
              <SpotlightCard
                className="custom-spotlight-card w-auto h-"
                spotlightColor="rgba(0, 229, 255, 0.2)"
              >
                <h2 className="text-2xl font-bold">Lista de Desejos</h2>
                <p className="text-muted-foreground text-lg mb-4">
                  Registre todos os jogos que você deseja comprar em seguida.
                </p>
                <div>
                  <Image
                    src="https://xnwjumqehhbrsbcupouv.supabase.co/storage/v1/object/public/nebula-images/Wishlist-Pic.png"
                    alt="Spotlight"
                    width={1200}
                    height={720}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </SpotlightCard>
            </section>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
