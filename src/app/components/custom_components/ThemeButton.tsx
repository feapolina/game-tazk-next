import { LucideSun } from "lucide-react";
import { FC } from "react";

interface ChangeThemeButtonProps {
  toggleHandleDark: () => void; // Tipagem para receber a função
}

const ChangeThemeButton: FC<ChangeThemeButtonProps> = ({
  toggleHandleDark,
}) => {
  return (
    <>
      <button
        className="p-2 w-fit h-fit flex justify-center items-center rounded-xl dark:text-white dark:border-2 text-neutral-900 border-2 shadow-sm"
        onClick={toggleHandleDark} // Chama a função passada como prop
      >
        <LucideSun />
      </button>
    </>
  );
};

export default ChangeThemeButton;
