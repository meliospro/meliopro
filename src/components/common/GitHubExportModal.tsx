import React, { useState } from 'react';
import { X, ExternalLink, Copy, Check, Download, GitBranch, Terminal } from 'lucide-react';

interface GitHubExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubExportModal: React.FC<GitHubExportModalProps> = ({ isOpen, onClose }) => {
  const [copiedCmd, setCopiedCmd] = useState(false);

  if (!isOpen) return null;

  const pushCommand = `git remote add origin https://github.com/<VOTRE-NOM-UTILISATEUR>/samataxi.git\ngit branch -M main\ngit push -u origin main`;

  const handleCopyCmd = () => {
    navigator.clipboard?.writeText(pushCommand);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-700 rounded-3xl p-6 text-white shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-white">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Publier sur votre compte GitHub</h2>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Dépôt prêt
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Dépôt Git initialisé et commité avec succès sur la branche <code>main</code>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Steps */}
        <div className="mt-5 space-y-4">
          {/* Step 1: Create repo on GitHub */}
          <div className="p-4 rounded-2xl bg-neutral-800/80 border border-neutral-700">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-400 text-neutral-950 font-black text-xs">
                  1
                </span>
                <h3 className="text-sm font-bold text-white">Créer le dépôt sur GitHub</h3>
              </div>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed mb-3">
              Créez un nouveau dépôt vide (nommé par exemple <code>samataxi</code>) sur votre compte GitHub sans cocher « Add README ».
            </p>
            <a
              href="https://github.com/new?name=samataxi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-neutral-100 text-neutral-950 font-bold rounded-xl text-xs transition"
            >
              <span>Créer un dépôt sur GitHub.com</span>
              <ExternalLink size={13} />
            </a>
          </div>

          {/* Step 2: Push code */}
          <div className="p-4 rounded-2xl bg-neutral-800/80 border border-neutral-700">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-400 text-neutral-950 font-black text-xs">
                  2
                </span>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Terminal size={15} className="text-amber-400" />
                  <span>Commande pour pousser le code</span>
                </h3>
              </div>
              <button
                onClick={handleCopyCmd}
                className="px-2.5 py-1 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-xs text-neutral-200 flex items-center gap-1 transition"
              >
                {copiedCmd ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                <span>{copiedCmd ? 'Copié' : 'Copier'}</span>
              </button>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed mb-2">
              Exécutez cette commande dans votre terminal, ou donnez-moi l'URL de votre dépôt dans le chat pour que je le pousse directement pour vous :
            </p>
            <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 font-mono text-[11px] text-amber-300 overflow-x-auto whitespace-pre leading-relaxed">
              {pushCommand}
            </div>
          </div>

          {/* Step 3: Direct Download archive */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-400 text-neutral-950 font-black text-xs">
                  3
                </span>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Download size={15} className="text-amber-400" />
                  <span>Téléchargement direct de l'archive (.tar.gz)</span>
                </h3>
              </div>
              <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-md font-semibold">
                11 MB
              </span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed mb-3">
              Vous pouvez aussi télécharger l'ensemble du projet prêt à l'emploi et l'importer directement via l'interface web de GitHub (bouton « Upload files »).
            </p>
            <a
              href="/samataxi-project.tar.gz"
              download="samataxi-project.tar.gz"
              className="w-full py-2.5 bg-[#F5B800] hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-md"
            >
              <Download size={14} />
              <span>Télécharger le code source complet</span>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
          <div className="flex items-center gap-1.5 text-neutral-300">
            <GitBranch size={13} className="text-amber-400" />
            <span>Branche : main • Commit initial prêt</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium transition"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
