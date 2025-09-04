FROM node:20-alpine AS build
WORKDIR /app

# install deps
COPY frontend/package.json ./
RUN npm install

# copy full source (including public/)
COPY frontend/ /app/

# build React app
ARG REACT_APP_API_BASE
ENV REACT_APP_API_BASE=${REACT_APP_API_BASE}
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
RUN printf '%s\n' 'server { listen 3000; server_name _; root /usr/share/nginx/html; index index.html; gzip on; location / { try_files $uri /index.html; } }' > /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
