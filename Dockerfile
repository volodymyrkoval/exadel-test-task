FROM node:12

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
COPY . .

EXPOSE 8080
CMD [ "sh", "-c", "npm run build && npm run start" ]
#CMD [ "npm", "run", "start:dev" ]
