# LeetCode Insights

LeetCode Insights is a full-stack application designed to provide analytics and insights into LeetCode problem-solving progress. This monorepo contains both the web frontend and the backend server.

## 🚀 Tech Stack

- **Monorepo Tooling**: [TurboRepo](https://turbo.build/)
- **Package Manager**: [Bun](https://bun.sh/)
- **Frontend**: [Next.js](https://nextjs.org/) (App Router), [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/)
- **Backend**: [Hono](https://hono.dev/) (Node.js)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Linting & Formatting**: [ESLint](https://eslint.org/), [Prettier](https://prettier.io/)

## 📂 Project Structure

```
.
├── apps
│   ├── web/          # Next.js frontend application
│   └── server/       # Hono backend server
├── packages
│   ├── ui/           # Shared UI component library
│   ├── eslint-config/# Shared ESLint configuration
│   └── typescript-config/ # Shared TypeScript configuration
```

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or higher)
- [Bun](https://bun.sh/) (v1.0 or higher)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd leetcode-insights
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

### Running the Application

To start both the web and server applications in development mode:

```bash
bun run dev
```

- **Web**: http://localhost:3000
- **Server**: http://localhost:8001

## 📦 Scripts

- `bun run build`: Build all applications and packages.
- `bun run dev`: Start existing applications in development mode.
- `bun run lint`: Lint all applications and packages.
- `bun run format`: Format code using Prettier.
