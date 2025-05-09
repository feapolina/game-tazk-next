import { Instagram, Linkedin, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="mb-8 md:mb-0">
            <h2 className="text-2xl font-bold mb-4">Game Tazk</h2>
            <p className="text-gray-400">Made with ❤️ by feapolina.</p>
          </div>
          <div></div>
          <div></div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow the Creator</h3>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/felipecvlc/"
                className="hover:text-gray-300 transition-colors"
              >
                <Instagram size={24} />
              </a>
              <a
                href="https://www.linkedin.com/in/felipe-cavalcanti-39a88a253/"
                className="hover:text-gray-300 transition-colors"
              >
                <Linkedin size={24} />
              </a>
              <a
                href="www.github.com/feapolina"
                className="hover:text-gray-300 transition-colors"
              >
                <Github size={24} />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Game Tazk. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
