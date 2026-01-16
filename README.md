# Lumina — AI-powered web app builder

![Lumina Logo](https://raw.githubusercontent.com/ABHAY627/Lumina-AI-powered-web-app-builder/main/public/logo.svg)

Build apps and websites by chatting with AI — generate components, pages, and full projects with live previews and runnable sandboxes.

Live demo: [Go To Website](https://lumina-ai-powered-web-app-builder-u.vercel.app/)

---

## Posters

![Landing Poster](https://raw.githubusercontent.com/ABHAY627/Lumina-AI-powered-web-app-builder/main/public/Landing.png)

![Chats Poster](https://raw.githubusercontent.com/ABHAY627/Lumina-AI-powered-web-app-builder/main/public/Chats.png)

![Billing Poster](https://raw.githubusercontent.com/ABHAY627/Lumina-AI-powered-web-app-builder/main/public/Billing.png)

---

## Key features

- 🚀 Next.js 15 + React 19  
- 🎨 Tailwind v4 + Shadcn/ui  
- 📡 tRPC for full-stack type safety  
- 🔁 Inngest background jobs  
- 🧠 Inngest agent toolkit  
- 🔐 Clerk authentication  
- 💳 Clerk billing  
- 🧱 Component and app generation from AI prompts  
- 🗂️ Live project preview with URL access  
- 🖥️ E2B cloud sandboxes for runtime execution  
- 🐳 Docker-based sandbox templating  
- 🧠 AI model support (OpenAI, Anthropic, Grok)  
- 📦 Prisma + Neon for database integration  
- 🤖 CodeRabbit AI-powered PR reviews  
- 🧾 Built-in credit system with usage tracking  
- 🧪 Preview + code explorer toggle

---

## Why Lumina

Lumina helps designers, PMs, and developers quickly iterate on ideas by describing the interface and behavior in plain language. It produces usable code, runs previews in isolated sandboxes, and integrates billing and credits so you can safely control AI usage.

---

## Quickstart (local)

Requirements: Node 20+, pnpm (or npm/yarn), Docker (for local sandbox templating), Neon/Postgres, Clerk account, AI provider keys.

1. Clone
```bash
git clone https://github.com/ABHAY627/Lumina-AI-powered-web-app-builder.git
cd Lumina-AI-powered-web-app-builder
```

2. Install
```bash
pnpm install
```

3. Copy env and fill values
```bash
cp .env.example .env
# edit .env with your DATABASE_URL, CLERK keys, AI keys, INNGEST keys, etc.
```

4. Run
```bash
pnpm dev
# open http://localhost:3000
```

Try a prompt like:
> "Build a kanban board with drag-and-drop using react-beautiful-dnd and local state."

---

## Important env vars (examples)

- DATABASE_URL
- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
- CLERK_SECRET_KEY
- INNGEST_API_KEY
- INNGEST_AGENT_KEY
- OPENAI_API_KEY / ANTHROPIC_API_KEY / GROK_API_KEY
- NEON_PROJECT_ID
- S3 / STORAGE provider details

Refer to `.env.example` for the full set of expected variables.

---

## Architecture (summary)

- Frontend: Next.js 15 + React 19 (app dir) + Tailwind v4 + shadcn/ui  
- API: tRPC endpoints for type-safe communication  
- Background: Inngest for jobs & agents  
- Sandboxes: Docker-based E2B sandboxes for live previews  
- DB: Prisma + Neon (Postgres)  
- Auth & Billing: Clerk  
- AI: Pluggable adapters for OpenAI, Anthropic, Grok  
- PR Reviews & QA: CodeRabbit integrations

---

## Contributing

- Open issues for bugs and feature requests.
- Send PRs to main with tests and formatting.
- Add poster images to `public/` and reference them in README as needed.

---

## License & Credits

MIT (update LICENSE if necessary). Built with Open Source tools and AI.

---

⭐ If this project helped you, please star it!

Made with ❤️ by [ABHAY GAUTAM](https://github.com/ABHAY627)
