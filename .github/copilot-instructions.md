We use this stack for this project:

Core stack:
 - Next.js (Framework)
 - Typescript (Language)
 - Node.js (Runtime)
 - Drizzle ORM (Database ORM)
 - Supabase (Postgres - Database)
 - Zod (validation)
Component stack
 - Mantine (Component library)
 - Mantine React Table (Table component library)
 - Apache eCharts (Complex chart library. Note: if require simple chart, use Mantine Chart based on recharts)

we use pnpm for managing our dependencies.

Basic Project structure:
├── src                        # Most of project codes would be here
│   ├── app                    # App router (https://nextjs.org/docs/app)
│   ├── components             # Global UI components
│   ├── db                     # Anything related to DB
│   │   ├── drizzle
│   │   │   ├── connection.ts
│   │   │   └── schema.ts
│   │   └── supabase
│   │       ├── browser.ts
│   │       ├── middleware.ts
│   │       └── server.ts
│   ├── features                # Feature codes (user, etc.)
│   ├── lib                     # Helper and utils
│   └── middleware.ts
├── supabase                    # Supabase config, migrations, and seed
│   ├── migrations
│   └── seed.sql
├── eslint.config.mjs           # Everything below are mostly configs
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── README.md
├── tailwind.config.ts
└── tsconfig.json

Start a sentence with this emoji 🤖