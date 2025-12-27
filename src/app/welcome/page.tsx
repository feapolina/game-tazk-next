
"use client";

import Plasma from "@/app/components/react-bits/Plasma";
import { useMobile } from "@/hooks/use-mobile";

import Navbar from "../components/custom_components/Navbar";
import Footer from "../components/custom_components/Footer";
import ChromaGrid from "@/app/components/react-bits/ChromaGrid";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";

export default function WelcomePage() {
  const isMobile = useMobile();
  const items = [
    {
      image: "/assets/PlayingNow-Pic.png",
      title: "Organização",
      subtitle: "Gerencie sua biblioteca por plataforma e status.",
      borderColor: "#8b5cf6",
      gradient: "linear-gradient(145deg, #8b5cf6, #000)",
    },
    {
      image: "/assets/ToDoList-Pic.png",
      title: "Mantenha controle dos objetivos",
      subtitle: "Crie e organize tarefas para alcançar seus objetivos.",
      borderColor: "#ec4899",
      gradient: "linear-gradient(145deg, #110b0eff, #000)",
    },
    {
      image: "/assets/Wishlist-Pic.png",
      title: "Lista de Desejos",
      subtitle: "Crie uma wishlist de jogos!",
      borderColor: "#06b6d4",
      gradient: "linear-gradient(145deg, #06b6d4, #000)",
    }
  ];

  return (
    <div className="bg-background text-foreground selection:bg-violet-500/30">
      {/* Section 1: Hero (Full Screen) */}
      <section className="relative h-screen w-full flex flex-col overflow-hidden">
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
          <Plasma
            color="#ae00ff"
            speed={isMobile ? 0 : 1}
            direction="forward"
            scale={2}
            opacity={1}
            mouseInteractive={!isMobile}
          />
        </div>

        {/* Content Layer */}
        <div className="relative z-10 flex flex-col h-full">
          <Navbar transparent />

          <main className={`flex-grow flex flex-col items-center justify-center p-8 text-center ${isMobile ? '' : 'animate-in zoom-in-95 duration-1000'}`}>
            <div className="max-w-3xl space-y-8">
              <h1 className="text-3xl md:text-6xl font-bold tracking-tighter leading-tight py-2 bg-gradient-to-br from-violet-400 via-fuchsia-300 to-white bg-clip-text text-transparent drop-shadow-sm">
                Seu organizador definitivo de bibliotecas de jogos.
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light max-w-2xl mx-auto">
                Gerencie, acompanhe e descubra sua próxima aventura.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-9">
                <Link href="/signup">
                  <Button size="lg" className="w-full sm:w-auto font-semibold px-8 h-12 rounded-full shadow-[0_0_20px_rgba(139,92,246,0.3)] border-0">
                    Começar
                  </Button>
                </Link>
                <Link href="#features">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 h-12 rounded-full backdrop-blur-sm">
                    Ver Funcionalidades
                  </Button>
                </Link>
              </div>
            </div>
          </main>
          
          {/* Scroll Indicator */}
          <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground ${isMobile ? '' : 'animate-bounce'}`}>
            <span className="text-sm tracking-widest uppercase opacity-50">Role para ver mais</span>
          </div>
        </div>
      </section>

      {/* Section 2: Features */}
      <section id="features" className="min-h-screen bg-card border-t border-border p-8 md:p-20 flex flex-col items-center justify-center">
        <div className="w-full space-y-16">
           <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
                Funcionalidades
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Tudo que você precisa para assumir o controle da sua coleção de jogos.
              </p>
           </div>
           
           <div style={{ minHeight: '600px', position: 'relative' }}>
             <ChromaGrid 
               items={items}
               radius={300}
               damping={0.45}
               fadeOut={0.6}
               ease="power3.out"
               isMobile={isMobile}
             />
           </div>
        </div>
      </section>
    </div>
  );
}

