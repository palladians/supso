FROM oven/bun:canary

WORKDIR /app

COPY assets /app/assets
COPY src /app/src
COPY bun.lockb package.json tsconfig.json /app/

RUN apt-get update && apt-get install unzip

# Ensure we're 100% on the newest version
RUN bun upgrade --canary

RUN bun i

CMD bun run start
