FROM node:18.19.1-alpine
COPY --chown=node:node . .
USER node
