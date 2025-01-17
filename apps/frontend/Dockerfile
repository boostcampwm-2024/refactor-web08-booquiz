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

COPY apps/frontend/package.json apps/frontend/
COPY apps/frontend/tsconfig*.json apps/frontend/

# 의존성 설치
RUN pnpm install --frozen-lockfile

# 소스 복사
COPY apps/frontend apps/frontend

# 환경 변수 설정
ARG VITE_API_URL
ARG VITE_WS_URL

ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_WS_URL=${VITE_WS_URL}

# 빌드
WORKDIR /app/apps/frontend
RUN pnpm run build

# Production stage with Nginx
FROM nginx:alpine

# Nginx 설정 복사
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

# 빌드된 파일 복사
COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html

EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]