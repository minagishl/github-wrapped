import { useState } from "react";
import { useNavigate } from "react-router";
import { Github, Lock, Loader2 } from "lucide-react";
import { AboutModal } from "../components/AboutModal";

export function meta() {
  return [
    { title: "GitHub Wrapped" },
    { name: "description", content: "Your year in code, wrapped." },
  ];
}

export default function Home() {
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;

    setIsLoading(true);
    const params = new URLSearchParams();
    if (token) params.set("token", token);

    setTimeout(() => {
      navigate(`/wrapped/${username}?${params.toString()}`);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-github-canvas-default text-github-fg-default flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />

      <div className="z-10 w-full max-w-sm space-y-6">
        <div className="text-center space-y-4 mb-8">
          <div className="inline-flex items-center justify-center mb-2">
            <Github className="w-12 h-12 text-github-fg-default" />
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-github-fg-default">
            GitHub Wrapped
          </h1>
          <p className="text-lg text-github-fg-muted">
            Your year in code, visualized.
          </p>
        </div>

        <div className="bg-github-canvas-subtle border border-github-border-default rounded-md p-6 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-github-fg-default"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-1.5 rounded-md bg-github-canvas-default border border-github-border-default focus:border-github-accent-fg focus:ring-2 focus:ring-github-accent-fg/30 outline-none transition-all text-github-fg-default placeholder-github-fg-muted text-sm"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="token"
                  className="block text-sm font-medium text-github-fg-default"
                >
                  Personal Access Token
                </label>
                <span className="text-xs text-github-fg-muted font-normal">
                  Optional
                </span>
              </div>
              <input
                id="token"
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full px-3 py-1.5 rounded-md bg-github-canvas-default border border-github-border-default focus:border-github-accent-fg focus:ring-2 focus:ring-github-accent-fg/30 outline-none transition-all text-github-fg-default placeholder-github-fg-muted text-sm"
                disabled={isLoading}
              />
              <p className="text-xs text-github-fg-muted mt-1">
                Required for private repositories.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-1.5 rounded-md bg-github-success-emphasis text-white font-medium text-sm hover:bg-github-success-fg disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer transition-colors flex items-center justify-center gap-2 border border-github-border-muted shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>Generate Wrapped</>
              )}
            </button>
          </form>
        </div>

        <div className="text-center space-y-2">
          <p className="text-xs text-github-fg-muted">
            <Lock className="w-3 h-3 inline mr-1" />
            Securely fetches data from GitHub API.
          </p>
          <p className="text-xs text-github-fg-muted flex items-center justify-center gap-2">
            <button
              onClick={() => setIsAboutOpen(true)}
              className="hover:text-github-accent-fg hover:underline cursor-pointer"
            >
              About
            </button>
            <span>·</span>
            <a
              href="https://github.com/minagishl/github-wrapped"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-github-accent-fg hover:underline"
            >
              View on GitHub
            </a>
            <span>·</span>
            <span>
              Created by{" "}
              <a
                href="https://github.com/minagishl"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-github-accent-fg hover:underline"
              >
                Minagishl
              </a>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
