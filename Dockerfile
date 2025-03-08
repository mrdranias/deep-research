FROM node:22

# Install nano
RUN apt-get update && apt-get install -y nano

WORKDIR /app
COPY package.json package-lock.json ./
COPY . .
COPY .env.local ./.env.local
RUN npm install

CMD ["sh"]
