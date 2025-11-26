import { Mail, Github, ExternalLink } from 'lucide-react';

export function AppFooter() {
  return (
    <footer className="border-t border-neutral-800/50 bg-neutral-900/50">
      <div className="max-w-4xl mx-auto px-4 py-6 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-neutral-500">

          {/* Copyright Disclaimer */}
          <div className="flex-1 text-center md:text-left">
            <p className="mb-2">
              <span className="font-medium">Hegemony Companion</span> - Unofficial fan app
            </p>
            <p className="text-xs">
              © {new Date().getFullYear()} Lukáš Walek |
              Hegemony™ board game content © respective publishers
            </p>
          </div>

          {/* Author Links */}
          <div className="flex items-center gap-4">
            <a
              href="mailto:l.walek@proton.me"
              className="flex items-center gap-1 text-neutral-400 hover:text-white transition-colors"
              title="Email author"
            >
              <Mail className="w-4 h-4" />
              <span className="hidden sm:inline">Contact</span>
            </a>
            <a
              href="https://github.com/Sinimus/hegemony-companion-app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-neutral-400 hover:text-white transition-colors"
              title="View on GitHub"
            >
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
            <a
              href="https://github.com/Sinimus/hegemony-companion-app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-neutral-400 hover:text-white transition-colors"
              title="Deployed version"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">Deploy</span>
            </a>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-4 pt-4 border-t border-neutral-800/30">
          <p className="text-xs text-neutral-600 text-center">
            Unofficial companion app. All Hegemony game rules and intellectual property belong to their respective owners.
          </p>
        </div>
      </div>
    </footer>
  );
}