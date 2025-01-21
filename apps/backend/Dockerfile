# Builder stage
FROM node:20-alpine AS builder

# 작업 디렉토리 설정
WORKDIR /app

# pnpm 설치
RUN npm install -g pnpm

# 의존성 파일 복사
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY tsconfig.base.json ./
COPY packages/shared /app/packages/shared

COPY apps/backend/package.json apps/backend/
COPY apps/backend/tsconfig*.json apps/backend/

# 의존성 설치
RUN pnpm install --frozen-lockfile

# 소스 복사
COPY apps/backend apps/backend

# 빌드
WORKDIR /app/apps/backend
RUN pnpm run build

# Production stage
FROM node:20-alpine AS production

# 작업 디렉토리 설정
WORKDIR /app

# pnpm 설치
RUN npm install -g pnpm

# pm2 설치
RUN npm install -g pm2

# shared 패키지와 workspace 설정 파일들 복사
COPY --from=builder /app/packages/shared ./packages/shared
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml

# package.json 복사 및 프로덕션 의존성 설치
COPY --from=builder /app/apps/backend/package.json ./package.json
RUN pnpm install --prod

# 빌드된 파일 복사
COPY --from=builder /app/apps/backend/dist ./dist

# 환경 변수 설정
ARG NODE_ENV
ARG SESSION_SECRET
ARG MYSQL_HOST
ARG DB_PORT
ARG DB_USERNAME
ARG DB_PASSWORD
ARG DB_DATABASE
ARG DB_SYNCHRONIZE

ENV NODE_ENV=${NODE_ENV}
ENV SESSION_SECRET=${SESSION_SECRET}
ENV MYSQL_HOST=${MYSQL_HOST}
ENV DB_PORT=${DB_PORT}
ENV DB_USERNAME=${DB_USERNAME}
ENV DB_PASSWORD=${DB_PASSWORD}
ENV DB_DATABASE=${DB_DATABASE}
ENV DB_SYNCHRONIZE=${DB_SYNCHRONIZE}

EXPOSE 3000

# pm2를 사용하여 애플리케이션 실행
CMD ["pm2-runtime", "start", "dist/src/main.js"]