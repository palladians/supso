FROM oven/bun:canary

WORKDIR /app

COPY . .

RUN apt-get update && apt-get install unzip

# Ensure we're 100% on the newest version
RUN bun upgrade --canary

RUN bun i

CMD bun run start
