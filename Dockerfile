FROM node:latest

RUN mkdir /opt/project-arklay
COPY ./node_modules /opt/project-arklay/node_modules
COPY ./server /opt/project-arklay/server

WORKDIR /opt/project-arklay

EXPOSE 8080 80 443

CMD ["node", "server/server"]
