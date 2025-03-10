FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.15.2 --activate

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects anonymous telemetry data about general usage
ENV NEXT_TELEMETRY_DISABLED=1

ARG SUPABASE_URL
ENV SUPABASE_URL=${SUPABASE_URL}
ARG SUPABASE_ANON_KEY
ENV SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}

RUN pnpm build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED=1

ARG SUPABASE_URL
ENV SUPABASE_URL=${SUPABASE_URL}
ARG SUPABASE_ANON_KEY
ENV SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
