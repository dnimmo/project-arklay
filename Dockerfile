FROM node:latest

RUN mkdir /opt/project-arklay
COPY ./package.json /opt/project-arklay/package.json
COPY ./node_modules /opt/project-arklay/node_modules
COPY ./client /opt/project-arklay/client
COPY ./server /opt/project-arklay/server

WORKDIR /opt/project-arklay

EXPOSE 8080 80 443

CMD ["npm", "start"]
