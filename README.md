# React Reports Builder

A modern Next.js boilerplate with TypeScript, Tailwind CSS v4, Shadcn UI, and Redux Toolkit.

## Features

- ⚡️ **Next.js 15** - Latest Next.js with App Router
- 🎨 **Tailwind CSS v4** - Utility-first CSS framework
- 🧩 **Shadcn UI** - Beautiful, accessible components
- 🔄 **Redux Toolkit** - State management
- 📘 **TypeScript** - Type-safe development
- 🎯 **ESLint** - Code linting

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── providers.tsx      # Redux provider
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Shadcn UI components
│   └── counter.tsx       # Example counter component
├── lib/                  # Utilities and configuration
│   ├── store.ts         # Redux store
│   ├── hooks.ts         # Typed Redux hooks
│   ├── slices/          # Redux slices
│   └── utils.ts         # Utility functions
└── public/              # Static assets
```

## Redux Setup

The project includes a Redux store with a counter example. To add new slices:

1. Create a new slice in `lib/slices/`
2. Add it to the store in `lib/store.ts`
3. Use typed hooks from `lib/hooks.ts`

## Adding Shadcn Components

To add more Shadcn UI components, you can use the CLI or manually add them to `components/ui/`.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn UI Documentation](https://ui.shadcn.com)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org)

