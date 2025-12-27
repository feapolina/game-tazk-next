import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { LogOut, User } from "lucide-react";

import { ModeToggle } from "@/app/components/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Button } from "@/app/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";

import { cn } from "@/app/lib/utils";

interface NavbarProps {
  transparent?: boolean;
}

// Helper function to generate deterministic gradient based on name
const getGradient = (name: string) => {
  const gradients = [
    "bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500",
    "bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500",
    "bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500",
    "bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500",
    "bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500",
    "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500",
    "bg-gradient-to-br from-pink-500 via-rose-500 to-orange-500",
    "bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500",
  ];
  
  if (!name) return gradients[0];
  
  // Use sum of char codes to pick index
  const charCodeSum = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return gradients[charCodeSum % gradients.length];
};

export default function Navbar({ transparent = false }: NavbarProps) {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.full_name) {
        const firstName = user.user_metadata.full_name.split(" ")[0];
        setUserName(firstName);
      }
    };
    getUser();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/welcome");
  };

  return (
    <nav className={cn(
      "w-full relative flex items-center p-4 transition-colors duration-300",
      transparent 
        ? "bg-transparent border-transparent" 
        : "bg-white/80 dark:bg-neutral-950/50 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-800"
    )}>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Image
          src="/logo_nebulosa_app.svg"
          width={180}
          height={40}
          alt="Nebula Logo"
          className="object-contain"
        />
      </div>
      <div className="flex items-center gap-4 ml-auto">
        <ModeToggle />
        {transparent ? (
          <Link href="/login">
            <Button variant="ghost" className="text-white hover:text-white/80 hover:bg-white/10 font-medium border border-purple-500 cursor-pointer">
              Entrar
            </Button>
          </Link>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full w-10 h-10 p-0 overflow-hidden cursor-pointer">
                 <Avatar className="h-full w-full">
                    <AvatarFallback 
                      className={cn(
                        "text-white font-medium",
                        getGradient(userName)
                      )}
                    >
                      {userName ? userName[0].toUpperCase() : "G"}
                    </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {userName ? `Olá, ${userName}.` : "Minha Conta"}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-100 dark:focus:bg-red-900/20">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </nav>
  );
}
