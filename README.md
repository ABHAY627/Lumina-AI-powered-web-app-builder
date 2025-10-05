# Lumina: AI-Powered Web App Builder

![Lumina Poster](https://raw.githubusercontent.com/ABHAY627/Lumina-AI-powered-web-app-builder/main/assets/poster1.png)
![Lumina Poster 2](https://raw.githubusercontent.com/ABHAY627/Lumina-AI-powered-web-app-builder/main/assets/poster2.png)

_Lumina_ is an innovative AI-driven platform that empowers you to build, manage, and deploy web applications seamlessly. Built with modern technologies like Next.js, Tailwind CSS (via shadcn/ui), PostgreSQL (provisioned by Neon), Prisma ORM, and Inngest for event-driven backend workflows, Lumina brings speed, flexibility, and intelligence to web development.

---

## 🚀 Features

- **AI-Powered App Building:** Generate and customize web apps with the help of AI.
- **Modern UI/UX:** Built with [Next.js](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/), and [shadcn/ui](https://ui.shadcn.com/) for a sleek and responsive design.
- **Robust Database Layer:** Uses [PostgreSQL](https://www.postgresql.org/) via [Neon](https://neon.tech/) for scalable, serverless database operations, managed with [Prisma ORM](https://www.prisma.io/).
- **Event-Driven Backend:** [Inngest](https://www.inngest.com/) powers background jobs, workflow automation, and web activity recording.
- **Easy Deployment:** Deploy anywhere Next.js apps run, with first-class support for Vercel.

---

## 🖼️ Clickable Posters

[![Lumina Poster 1](https://raw.githubusercontent.com/ABHAY627/Lumina-AI-powered-web-app-builder/main/assets/poster1.png)](https://github.com/ABHAY627/Lumina-AI-powered-web-app-builder)
[![Lumina Poster 2](https://raw.githubusercontent.com/ABHAY627/Lumina-AI-powered-web-app-builder/main/assets/poster2.png)](https://github.com/ABHAY627/Lumina-AI-powered-web-app-builder)

---

## 🛠️ Tech Stack

- **Frontend:** [Next.js](https://nextjs.org/), [shadcn/ui](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/)
- **Database:** [PostgreSQL](https://www.postgresql.org/) via [Neon](https://neon.tech/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Backend/Events:** [Inngest](https://www.inngest.com/)
- **Hosting:** [Vercel](https://vercel.com/) (recommended), or any Node.js host

---

## ⚡ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/ABHAY627/Lumina-AI-powered-web-app-builder.git
cd Lumina-AI-powered-web-app-builder
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Setup Environment Variables

Copy `.env.example` to `.env` and fill out your configuration.  
You'll need credentials for Neon PostgreSQL, Prisma, and Inngest.

```env
DATABASE_URL=postgresql://...
INNGEST_API_KEY=...
NEXT_PUBLIC_API_KEY=...
```

### 4. Prisma Migrate

```bash
npx prisma generate
npx prisma migrate dev
```

### 5. Run the App

```bash
npm run dev
# or
yarn dev
```

The app will be running at [http://localhost:3000](http://localhost:3000).

---

## 🤝 Contributing

We welcome contributions! Please open issues or pull requests for bug fixes, feature requests, or improvements.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🌟 Acknowledgements

- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Neon](https://neon.tech/)
- [Prisma](https://www.prisma.io/)
- [Inngest](https://www.inngest.com/)

---

Made with ❤️ by Abhay Gautam 

> _Empower your ideas. Build with Lumina._
