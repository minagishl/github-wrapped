# GitHub Wrapped

An unofficial "Spotify Wrapped" style experience for your GitHub year in review. Visualize your coding journey, discover your persona, and share your achievements.

Built with **React Router v7**, **Cloudflare Workers**, and **GitHub Primer** design aesthetics.

## Features

- **Dynamic Slideshow**: A smooth, interactive presentation of your year in code.
- **Advanced Statistics**:
  - **Most Productive Month**: See when you were on fire.
  - **Longest Streak**: Track your consistency.
  - **Universal Rank**: See how you compare globally (Top 1%, etc.).
  - **Top Languages**: Visual breakdown of your tech stack.
- **Coding Persona**: Are you a "Night Owl", "Early Bird", or "Lunchtime Coder"?
- **GitHub Design System**: Styled using GitHub's official **Primer** color palette (Dark Mode) for a native feel.
- **Privacy First**:
  - Works with public data by default.
  - Optional Personal Access Token (PAT) for private stats.
  - **Tokens are never stored** and are sent directly to the GitHub API.
- **Export & Share**: Download any scene as an image to share on social media.

## Tech Stack

- **Framework**: [React Router v7](https://reactrouter.com/) (SSR + SPA)
- **Deployment**: [Cloudflare Workers](https://workers.cloudflare.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + GitHub Primer Colors
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query) + [Octokit](https://github.com/octokit/octokit.js)
- **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

1. **Install dependencies**:

   ```bash
   pnpm install
   ```

2. **Run the development server**:

   ```bash
   pnpm run dev
   ```

3. **Open the app**:
   Visit [http://localhost:5173](http://localhost:5173)

## Deployment

Deploy to Cloudflare Workers:

```bash
pnpm run deploy
```

## Disclaimer

This project is **unofficial** and is not affiliated with, endorsed, or sponsored by GitHub, Inc.
"GitHub" and the GitHub logo are trademarks of GitHub, Inc.

---

Created by [Minagishl](https://github.com/minagishl)

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
