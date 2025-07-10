# Neorar Chat

A modern chat interface built with Next.js 14, shadcn/ui, and TypeScript in dark mode.

## Features

- 🌙 Dark mode by default
- 💬 Real-time chat interface
- 🎨 Modern UI with shadcn/ui components
- 📱 Responsive design
- ⚡ Fast and lightweight
- 🔧 TypeScript support

## Getting Started

First, install the dependencies:

```bash
pnpm install
```

Then, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Built With

- [Next.js 14](https://nextjs.org/) - React framework
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Radix UI](https://www.radix-ui.com/) - Accessible components
- [Lucide React](https://lucide.dev/) - Icons

## Project Structure

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   │   ├── avatar.tsx
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── scroll-area.tsx
│   └── chat-interface.tsx
└── lib/
    └── utils.ts
```

## Chat Interface

The chat interface includes:

- Message display with timestamps
- User and bot avatars
- Typing indicator
- Auto-scrolling to latest messages
- Send button and Enter key support
- Responsive design for mobile and desktop 