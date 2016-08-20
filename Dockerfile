FROM node:latest

RUN mkdir /opt/project-arklay
COPY ./package.json /opt/project-arklay/package.json
COPY ./server /opt/project-arklay/server
RUN npm install

WORKDIR /opt/project-arklay

EXPOSE 8080 80 443

CMD ["npm", "start"]
