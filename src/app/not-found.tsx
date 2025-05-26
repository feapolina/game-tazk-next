import Image from "next/image";
import { Button } from "./components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="relative w-full h-screen">
      {/* Background em tela cheia */}
      <Image
        src="/assets/not_found_background.png"
        alt="Background"
        layout="fill"
        objectFit="cover"
        priority
      />

      {/* Conteúdo sobreposto */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20">
        <h1 className="text-6xl font-black text-white">404</h1>
        <p className="mt-4 text-xl font-semibold text-white">
          Acho que você se perdeu no caminho da nebulosa...
        </p>
        <Button className="mt-6 bg-purple-600 hover:bg-purple-700 text-white">
          <a href="/" className="hover:underline">
            Voltar para a página inicial
          </a>
        </Button>
      </div>
    </div>
  );
}
