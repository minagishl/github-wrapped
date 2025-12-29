import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./queryClient";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="min-h-screen bg-github-canvas-default text-github-fg-default flex flex-col items-center justify-center p-4 text-center font-sans">

      
      <h1 className="text-2xl font-bold text-github-fg-default mb-2">
        {message}
      </h1>
      <p className="text-github-fg-muted mb-8 max-w-md">
        {details}
      </p>
      
      {stack && (
        <pre className="w-full max-w-2xl p-4 overflow-x-auto bg-github-canvas-subtle rounded-md text-left mb-8 text-xs text-github-fg-muted border border-github-border-default">
          <code>{stack}</code>
        </pre>
      )}

      <a
        href="/"
        className="px-6 py-2 bg-github-canvas-subtle border border-github-border-default text-github-fg-default rounded-md font-medium hover:bg-github-border-muted transition-colors text-sm"
      >
        Return Home
      </a>
    </main>
  );
}
