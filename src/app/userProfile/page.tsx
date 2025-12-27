import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import Navbar from "../components/custom_components/Navbar";
import { Badge } from "@/app/components/ui/badge";
import { LucidePlus } from "lucide-react";

export default function UserProfile() {
  return (
    <>
      <Navbar />
      <div className="bg-gray-800 min-h-screen w-screen p-2">
        {/* Capa Banner do usuário */}
        <div className="bg-gray-400 rounded-md h-58 relative md:h-72">
          <img
            className="w-full h-full rounded-md object-cover"
            src="/assets/user-profile-cover-4.jpg"
            alt=""
          />
          {/* Escurecimento da parte de baixo da capa */}
          <div className="w-full h-15 bg-linear-to-t from-black/80 to-transparent absolute left-0 bottom-0 rounded-md"></div>

          {/* Avatar de Usuário */}
          <div className=" absolute bottom-0 left-2 translate-y-1/2">
            <Avatar className="size-32 border-6 border-gray-800">
              <AvatarImage src="/assets/profile-pic.jpg" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </div>
        <div className=" w-full mt-17 items-center md:flex gap-5">
          <div className="w-fit h-auto mt-2 truncate">
            <div className="text-white flex justify-center items-center gap-3">
              <h2 className="text-2xl font-semibold break-words ">
                Maria Clara Gomes
              </h2>
              <div className="w-fit h-auto">
                <Badge className="">Namorada do Criador</Badge>
              </div>
            </div>
          </div>
          <p className="text-white/40">@claramaria08</p>
        </div>

        {/* Area de Jogos Favoritos */}
        <div className="rounded-lg w-auto h-auto mt-6">
          <h2 className="text-2xl font-semibold text-white mb-2">
            Jogos Favoritos
          </h2>
          <div className="flex overflow-x-auto whitespace-nowrap space-x-2">
            <div className="bg-green-200 size-32 md:size-64 flex-shrink-0 inline-block rounded-lg">
              <img
                className="object-cover w-full h-full rounded-lg"
                src="/assets/user-profile-cover-2.jpg"
                alt=""
              />
            </div>
            <div className="bg-green-200 size-32 md:size-64 flex-shrink-0 inline-block rounded-lg">
              <img
                className="object-cover w-full h-full rounded-lg"
                src="/assets/user-profile-cover-3.jpg"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
