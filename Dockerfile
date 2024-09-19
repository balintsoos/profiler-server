FROM node:22.9.0-alpine3.20
COPY --chown=node:node . .
USER node
