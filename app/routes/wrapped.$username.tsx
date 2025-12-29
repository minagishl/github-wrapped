import { useParams, useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { WrappedPlayer } from "../components/WrappedPlayer";
import type { WrappedData } from "../types";
import { Loader2 } from "lucide-react";

export default function WrappedPage() {
  const { username } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const { data, isLoading, error } = useQuery<WrappedData>({
    queryKey: ["wrapped", username, token],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (token) params.set("token", token);
      const res = await fetch(`/api/github/${username}?${params.toString()}`);
      if (!res.ok) {
        const err = (await res.json()) as any;
        throw new Error(err.message || "Failed to fetch data");
      }
      return res.json();
    },
    enabled: !!username,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-github-canvas-default text-github-fg-default flex flex-col items-center justify-center space-y-4 font-sans">
        <Loader2 className="w-8 h-8 animate-spin text-github-fg-muted" />
        <p className="text-github-fg-muted text-sm font-medium">
          Generating your Wrapped...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-github-canvas-default text-github-fg-default flex flex-col items-center justify-center p-4 text-center font-sans">
        <h1 className="text-2xl font-bold text-github-fg-default mb-2">
          User not found
        </h1>
        <p className="text-github-fg-muted mb-8 max-w-md">
          {(error as Error).message.includes("Not Found")
            ? "The username you entered doesn't exist on GitHub. Please check the spelling and try again."
            : (error as Error).message}
        </p>

        <a
          href="/"
          className="px-6 py-2 bg-github-canvas-subtle border border-github-border-default text-github-fg-default rounded-md font-medium hover:bg-github-border-muted transition-colors text-sm"
        >
          Return Home
        </a>
      </div>
    );
  }

  if (!data) return null;

  return <WrappedPlayer data={data} />;
}
