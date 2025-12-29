import { type LoaderFunctionArgs } from "react-router";
import { fetchGitHubData } from "../api/github.server";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const username = params.username;
  if (!username) {
    throw new Response("Username is required", { status: 400 });
  }

  const url = new URL(request.url);
  const token = url.searchParams.get("token") || undefined;

  try {
    const data = await fetchGitHubData(username, token);
    return Response.json(data);
  } catch (error: any) {
    console.error("GitHub API Error:", error);
    return Response.json(
      { message: error.message || "Failed to fetch GitHub data" },
      { status: error.status || 500 }
    );
  }
}
