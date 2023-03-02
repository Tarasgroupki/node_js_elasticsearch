FROM node:14

ARG APP_DIR=app
RUN mkdir -p ${APP_DIR}
WORKDIR ${APP_DIR}

COPY package*.json ./
RUN npm cache clean -f
RUN npm install \
 && npm audit fix

COPY . .

EXPOSE 2700

CMD ["npm", "start"]
