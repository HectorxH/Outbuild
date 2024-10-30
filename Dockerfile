FROM node:22-alpine

WORKDIR /outbuild
COPY package*.json .
RUN npm install

COPY ./src ./src
COPY ./tsconfig.json .
RUN npm run build

CMD ["npm", "run", "start"]
